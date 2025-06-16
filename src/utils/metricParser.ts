import { MetricData, MetricWithStats } from "../context/types";

export const loadMetricsFile = async (): Promise<MetricData[]> => {
  try {
    const response = await fetch("/SignalDownload_25-05-May.json");
    if (!response.ok) {
      throw new Error("Failed to load metrics file");
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading metrics file:", error);
    throw error;
  }
};

const calculateStandardDeviation = (values: number[]): number => {
  const n = values.length;
  if (n <= 1) return 0; // Need at least 2 values for standard deviation

  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (n - 1); // Using n-1 for sample standard deviation

  return Math.sqrt(variance);
};

const calculateMedian = (values: number[]): number => {
  const sorted = values.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const getUniqueMetrics = (
  metricsData: MetricData[]
): MetricWithStats[] => {
  const metricMap = new Map<string, MetricWithStats>();

  metricsData.forEach((metric) => {
    const key = `${metric.Metric} (${metric["Metric ID"]})`;
    if (!metricMap.has(key)) {
      metricMap.set(key, {
        metric: metric.Metric,
        count: 0,
        id: metric["Metric ID"],
        averageValue: 0,
        medianValue: 0,
        standardDeviation: 0,
        values: [],
      });
    }

    const current = metricMap.get(key)!;
    current.count++;
    current.values?.push(metric);
  });

  // Calculate statistics for each metric
  metricMap.forEach((metric) => {
    if (metric.values && metric.values.length > 0) {
      metric.averageValue =
        metric.values.reduce((sum, val) => sum + val.Value, 0) /
        metric.values.length;
      metric.standardDeviation = calculateStandardDeviation(
        metric.values.map((v) => v.Value)
      );
      metric.medianValue = calculateMedian(metric.values.map((v) => v.Value));
    }
  });

  return Array.from(metricMap.values()).sort((a, b) =>
    a.metric.localeCompare(b.metric)
  );
};

export const loadAndGetMetrics = async (): Promise<MetricWithStats[]> => {
  const metricsData = await loadMetricsFile();
  return getUniqueMetrics(metricsData);
};

export const getAggregateMetrics = async (
  metricSubstrings: string[]
): Promise<MetricWithStats[]> => {
  const metricsData = await loadMetricsFile();
  
  const aggregateMetrics = metricSubstrings.map((substring) => {
    const matchingMetrics = metricsData.filter((metric) =>
      metric.Metric.includes(substring)
    );
    
    // Group by provider (EMP CID + SER CID combination) to get per-provider aggregates
    const providerGroups = new Map<string, MetricData[]>();
    
    matchingMetrics.forEach((metric) => {
      const providerKey = `${metric["EMP CID"]}-${metric["SER CID"]}`;
      if (!providerGroups.has(providerKey)) {
        providerGroups.set(providerKey, []);
      }
      providerGroups.get(providerKey)!.push(metric);
    });
    
    // Calculate aggregate value per provider (sum of all subcategory values)
    const providerAggregateValues: MetricData[] = [];
    
    providerGroups.forEach((metrics, providerKey) => {
      const totalValue = metrics.reduce((sum, metric) => sum + metric.Value, 0);
      const firstMetric = metrics[0];
      
      // Create an aggregate metric entry for this provider
      const aggregateEntry: MetricData = {
        ...firstMetric,
        Metric: substring,
        Value: totalValue,
        "Metric ID": 0, // Aggregate metrics don't have specific IDs
      };
      
      providerAggregateValues.push(aggregateEntry);
    });
    
    const values = providerAggregateValues.map((m) => m.Value);
    const averageValue =
      values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
    const standardDeviation = calculateStandardDeviation(values);
    const medianValue = calculateMedian(values);

    return {
      metric: substring,
      count: providerAggregateValues.length,
      id: 0,
      averageValue,
      medianValue,
      standardDeviation,
      values: providerAggregateValues,
    };
  });

  return aggregateMetrics;
};

export const getProviderCohorts = (
  metric: MetricWithStats
): { top: MetricData[]; low: MetricData[]; mixed: MetricData[] } => {
  const top = [];
  const low = [];

  const useMedian = metric.averageValue > metric.medianValue;

  for (const value of metric.values) {
    if (useMedian) {
      if (value.Value < metric.medianValue) {
        top.push(value);
      } else {
        low.push(value);
      }
    } else {
      if (value.Value < metric.averageValue) {
        top.push(value);
      } else {
        low.push(value);
      }
    }
  }

  return {
    top,
    low,
    mixed: [], // Will be calculated at the context level
  };
};

export const getMixedProviders = (
  allMetrics: MetricWithStats[]
): MetricData[] => {
  // Group all providers across all metrics
  const providerMetricsMap = new Map<string, {
    provider: MetricData;
    topMetrics: string[];
    lowMetrics: string[];
  }>();

  allMetrics.forEach((metric) => {
    const { top, low } = getProviderCohorts(metric);
    
    // Track top performers
    top.forEach((provider) => {
      const key = `${provider["EMP CID"]}-${provider["SER CID"]}`;
      if (!providerMetricsMap.has(key)) {
        providerMetricsMap.set(key, {
          provider,
          topMetrics: [],
          lowMetrics: []
        });
      }
      providerMetricsMap.get(key)!.topMetrics.push(metric.metric);
    });

    // Track low performers
    low.forEach((provider) => {
      const key = `${provider["EMP CID"]}-${provider["SER CID"]}`;
      if (!providerMetricsMap.has(key)) {
        providerMetricsMap.set(key, {
          provider,
          topMetrics: [],
          lowMetrics: []
        });
      }
      providerMetricsMap.get(key)!.lowMetrics.push(metric.metric);
    });
  });

  // Find providers who have both top and low performance metrics
  const mixedProviders: MetricData[] = [];
  providerMetricsMap.forEach((data) => {
    if (data.topMetrics.length > 0 && data.lowMetrics.length > 0) {
      mixedProviders.push(data.provider);
    }
  });

  return mixedProviders;
};
