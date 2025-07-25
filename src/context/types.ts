export const METRIC_TITLES = {
  ORDERS: "(IP) Time in Orders per Patient per Day",
  IN_BASKET: "(IP) Time in In Basket per Patient per Day",
  DOCUMENTATION: "(IP) Time in Documentation per Patient per Day",
  COMMUNICATIONS: "(IP) Time in Communications per Patient per Day",
} as const;

// Outpatient-specific metric titles
export const OUTPATIENT_METRIC_TITLES = {
  ORDERS: "Time in Orders per Day",
  IN_BASKET: "In Basket", // Aggregated In Basket metrics
  DOCUMENTATION: "Notes", // Aggregated Notes metrics
  COMMUNICATIONS: "Secure Chat Messages Received per Day",
} as const;

export const aggregateParams = [
  METRIC_TITLES.IN_BASKET,
  METRIC_TITLES.DOCUMENTATION,
];

export const outpatientAggregateParams = ["In Basket", "Notes"];

export const possibleParams: MetricParam[] = [
  { title: METRIC_TITLES.DOCUMENTATION, metricId: null },
  { title: METRIC_TITLES.ORDERS, metricId: 2224 },
  {
    title: METRIC_TITLES.IN_BASKET,
    metricId: null,
  },
  { title: METRIC_TITLES.COMMUNICATIONS, metricId: 2282 },
];

export const outpatientPossibleParams: MetricParam[] = [
  { title: "Time in Notes per Day", metricId: null },
  { title: OUTPATIENT_METRIC_TITLES.ORDERS, metricId: null },
  { title: "Time in In Basket per Day", metricId: null },
  { title: OUTPATIENT_METRIC_TITLES.COMMUNICATIONS, metricId: null },
];

export const titleMap = {
  "(IP) Time in Communications per Patient per Day": "Communications",
  "(IP) Time in Orders per Patient per Day": "Orders",
  "(IP) Time in In Basket per Patient per Day": "In Basket",
  "(IP) Time in Documentation per Patient per Day": "Documentation",
  // Outpatient mappings
  "Time in Communications per Day": "Communications",
  "Time in Orders per Day": "Orders",
  "Time in In Basket per Day": "In Basket",
  "Time in Notes per Day": "Documentation",
  "Secure Chat Messages Received per Day": "Communications",
  // Aggregated outpatient mappings
  "In Basket": "In Basket",
  Notes: "Documentation",
};

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
  uploadData: (data: MetricData[]) => Promise<void>;
  clearData: () => void;
  dataType: "Inpatient" | "Outpatient";
}

export interface MetricData {
  "EMP CID": string;
  "SER CID": string;
  "Clinician Name": string;
  "Clinician Type": string;
  "Login Service Area"?: string;
  "Service Area"?: string;
  "Login Department"?: string;
  Department?: string;
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
