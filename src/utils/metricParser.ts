import { MetricCount } from "../context/types";

interface MetricData {
  "EMP CID": string;
  "SER CID": string;
  "Clinician Name": string;
  "Clinician Type": string;
  "Login Service Area": string;
  "Login Department": string;
  Specialty: string;
  "User Type": string;
  "Reporting Period Start Date": string;
  "Reporting Period End Date": string;
  Metric: string;
  Numerator: number;
  Denominator: number;
  Value: number;
  "Metric ID": number;
}

export const loadMetricsFile = async (): Promise<MetricData[]> => {
  try {
    const response = await fetch("/SignalDownload_25-05-May.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading metrics file:", error);
    return [];
  }
};

const calculateStandardDeviation = (values: number[], mean: number): number => {
  const squareDiffs = values.map((value) => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff =
    squareDiffs.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

export const getUniqueMetrics = async (): Promise<MetricCount[]> => {
  const metricsData = await loadMetricsFile();
  const metricMap = new Map<
    string,
    { count: number; id: number; values: number[] }
  >();

  metricsData.forEach((entry) => {
    if (entry.Metric) {
      const current = metricMap.get(entry.Metric) || {
        count: 0,
        id: entry["Metric ID"],
        values: [],
      };
      metricMap.set(entry.Metric, {
        count: current.count + 1,
        id: entry["Metric ID"],
        values: [...current.values, entry.Value],
      });
    }
  });

  return Array.from(metricMap.entries())
    .map(([metric, { count, id, values }]) => {
      const averageValue =
        values.reduce((sum, val) => sum + val, 0) / values.length;
      const standardDeviation = calculateStandardDeviation(
        values,
        averageValue
      );
      return {
        metric,
        count,
        id,
        averageValue,
        standardDeviation,
      };
    })
    .sort((a, b) => a.metric.localeCompare(b.metric));
};

export const getAggregateMetrics = async (
  metricSubstrings: string[]
): Promise<{
  aggregateMetrics: MetricData[];
  substringMatchCount: { metric: string; count: number }[];
}> => {
  const metricsData = await loadMetricsFile();

  // Initialize substringMatchCount with all substrings and zero counts
  const substringMatchCount = metricSubstrings.map((substring) => ({
    metric: substring,
    count: 0,
  }));

  const aggregateMetrics = metricsData.filter((metric) => {
    const found = metricSubstrings.some((substring) => {
      const match = metric.Metric?.includes(substring);
      if (match) {
        // Find and increment the count for this substring
        const matchCount = substringMatchCount.find(
          (m) => m.metric === substring
        );
        if (matchCount) {
          matchCount.count++;
        }
      }
      return match;
    });

    return found;
  });

  return { aggregateMetrics, substringMatchCount };
};
