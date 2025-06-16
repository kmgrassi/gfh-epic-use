import React, { createContext, useContext, useEffect, useState } from "react";
import { getAggregateMetrics, loadAndGetMetrics } from "../utils/metricParser";
import {
  aggregateParams,
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
      const [uniqueMetrics, aggregateMetrics] = await Promise.all([
        loadAndGetMetrics(),
        getAggregateMetrics(aggregateParams),
      ]);
      setMetrics(uniqueMetrics);

      setAggregateMetrics(aggregateMetrics);
    } catch (err) {
      setError("Failed to fetch metrics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

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
