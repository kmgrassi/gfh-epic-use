import { MetricCount, MetricData } from "../context/types";

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
  if (n === 0) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / n;

  return Math.sqrt(variance);
};

export const getUniqueMetrics = (metricsData: MetricData[]): MetricCount[] => {
  const metricMap = new Map<string, MetricCount>();

  metricsData.forEach((metric) => {
    const key = `${metric.Metric} (${metric["Metric ID"]})`;
    if (!metricMap.has(key)) {
      metricMap.set(key, {
        metric: metric.Metric,
        count: 0,
        id: metric["Metric ID"],
        averageValue: 0,
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
    }
  });

  return Array.from(metricMap.values()).sort((a, b) =>
    a.metric.localeCompare(b.metric)
  );
};

export const loadAndGetMetrics = async (): Promise<MetricCount[]> => {
  const metricsData = await loadMetricsFile();
  return getUniqueMetrics(metricsData);
};

export const getAggregateMetrics = async (
  metricSubstrings: string[]
): Promise<MetricCount[]> => {
  const metricsData = await loadMetricsFile();
  const substringMatchCount = metricSubstrings.map((substring) => {
    const matchingMetrics = metricsData.filter((metric) =>
      metric.Metric.includes(substring)
    );
    const values = matchingMetrics.map((m) => m.Value);
    const averageValue =
      values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
    const standardDeviation = calculateStandardDeviation(values);

    return {
      metric: substring,
      count: matchingMetrics.length,
      id: 0,
      averageValue,
      standardDeviation,
      values: matchingMetrics,
    };
  });

  return substringMatchCount;
};
