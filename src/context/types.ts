export interface MetricCount {
  metric: string;
  count: number;
  id: number;
  averageValue: number;
  standardDeviation: number;
}

export interface MetricParam {
  title: string;
  metricId: number | null;
}

export interface AggregateMetricCount {
  metric: string;
  count: number;
}

export interface MetricsContextType {
  metrics: MetricCount[];
  loading: boolean;
  error: string | null;
  selectedParams: string[];
  aggregateCounts: AggregateMetricCount[];
  setSelectedParams: (params: string[]) => void;
  refreshMetrics: () => Promise<void>;
}
