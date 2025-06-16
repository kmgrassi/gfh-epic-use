import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAggregateMetrics,
  getMetricsData,
  getUniqueMetrics,
} from "../utils/metricParser";
import {
  aggregateParams,
  MetricData,
  MetricsContextType,
  MetricWithStats,
  possibleParams,
} from "./types";

const MetricsContext = createContext<MetricsContextType | undefined>(
  {} as MetricsContextType
);

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<MetricWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParams, setSelectedParams] = useState<string[]>(
    possibleParams.map((param) => param.title)
  );
  const [aggregateMetrics, setAggregateMetrics] = useState<MetricWithStats[]>(
    []
  );
  const [uploadedMetricsData, setUploadedMetricsData] = useState<
    MetricData[] | null
  >(null);

  const filteredMetrics =
    selectedParams.length > 0
      ? metrics.filter((metric) => selectedParams.includes(metric.metric))
      : metrics;

  const totalCount = filteredMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the metrics data (either uploaded or default)
      const metricsData = await getMetricsData(uploadedMetricsData);

      const [uniqueMetrics, aggregate] = await Promise.all([
        Promise.resolve(getUniqueMetrics(metricsData)),
        getAggregateMetrics(aggregateParams, metricsData),
      ]);

      setMetrics(uniqueMetrics);
      setAggregateMetrics(aggregate);
    } catch (err) {
      setError("Failed to fetch metrics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadData = async (data: MetricData[]) => {
    // Set the uploaded data in state - useEffect will handle processing
    setUploadedMetricsData(data);
  };

  const clearData = () => {
    setUploadedMetricsData(null);
    // useEffect will trigger fetchMetrics when uploadedMetricsData changes
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedMetricsData]);

  const value = {
    metrics,
    loading,
    error,
    selectedParams,
    aggregateMetrics,
    setSelectedParams,
    refreshMetrics: fetchMetrics,
    filteredMetrics,
    totalCount,
    uploadData,
    clearData,
  };

  return (
    <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
};
export { possibleParams };
