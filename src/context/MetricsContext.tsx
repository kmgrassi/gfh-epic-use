import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAggregateMetrics,
  getUniqueMetrics,
  loadAndGetMetrics,
} from "../utils/metricParser";
import {
  AggregateMetricCount,
  MetricCount,
  MetricData,
  MetricParam,
  MetricsContextType,
} from "./types";

const aggregateParams = [
  "(IP) Time in In Basket per Patient per Day",
  "(IP) Time in Documentation per Patient per Day",
];

export const possibleParams: MetricParam[] = [
  { title: "(IP) Time in Documentation per Patient per Day", metricId: null },
  { title: "(IP) Time in Orders per Patient per Day", metricId: 2224 },
  {
    title: "(IP) Time in In Basket per Patient per Day",
    metricId: null,
  },
  { title: "(IP) Time in Communications per Patient per Day", metricId: 2282 },
];

const MetricsContext = createContext<MetricsContextType | undefined>(
  {} as MetricsContextType
);

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<MetricCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParams, setSelectedParams] = useState<string[]>(
    possibleParams.map((param) => param.title)
  );
  const [aggregateCounts, setAggregateCounts] = useState<
    AggregateMetricCount[]
  >([]);

  const filteredMetrics =
    selectedParams.length > 0
      ? metrics.filter((metric) => selectedParams.includes(metric.metric))
      : metrics;

  const totalCount = filteredMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );

  const [aggregateMetrics, setAggregateMetrics] = useState<MetricData[]>([]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [uniqueMetrics, aggregateMetrics] = await Promise.all([
        loadAndGetMetrics(),
        getAggregateMetrics(aggregateParams),
      ]);
      setMetrics(uniqueMetrics);
      setAggregateCounts(aggregateMetrics.substringMatchCount);
      setAggregateMetrics(aggregateMetrics.aggregateMetrics);
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

  useEffect(() => {
    if (aggregateMetrics.length > 0) {
      getUniqueMetrics(aggregateMetrics);
    }
  }, [aggregateMetrics]);

  const value = {
    metrics,
    loading,
    error,
    selectedParams,
    aggregateCounts,
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
