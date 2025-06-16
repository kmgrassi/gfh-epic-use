export interface MetricWithStats {
  metric: string;
  count: number;
  id: number;
  averageValue: number;
  medianValue: number;
  standardDeviation: number;
  values: MetricData[];
}

export interface MetricParam {
  title: string;
  metricId: number | null;
}

export interface MetricsContextType {
  metrics: MetricWithStats[];
  filteredMetrics: MetricWithStats[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  selectedParams: string[];
  aggregateMetrics: MetricWithStats[];
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
