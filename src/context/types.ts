export interface MetricCount {
  metric: string;
  count: number;
  id: number;
  averageValue: number;
  standardDeviation: number;
  values?: number[]; // Optional since we delete it after calculations
}

export interface MetricParam {
  title: string;
  metricId: number | null;
}

export interface AggregateMetricCount {
  metric: string;
  count: number;
  averageValue: number;
  standardDeviation: number;
}

export interface MetricsContextType {
  metrics: MetricCount[];
  filteredMetrics: MetricCount[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  selectedParams: string[];
  aggregateCounts: AggregateMetricCount[];
  setSelectedParams: (params: string[]) => void;
  refreshMetrics: () => Promise<void>;
}

export interface MetricData {
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
