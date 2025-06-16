import { MetricWithStats } from "../context/types";

interface MetricsHeaderProps {
  metrics: MetricWithStats[];
  defaultParams: { title: string; metricId: number }[];
}

export function MetricsHeader({ metrics, defaultParams }: MetricsHeaderProps) {
  const defaultMetrics = metrics.filter((metric) =>
    defaultParams.some((param) => param.metricId === metric.id)
  );

  const totalCount = defaultMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );
  const averageCount =
    defaultMetrics.length > 0
      ? Math.round(totalCount / defaultMetrics.length)
      : 0;

  return (
    <div className="metrics-header">
      <div className="metrics-summary">
        <div className="summary-item">
          <span className="summary-label">Default Parameters:</span>
          <span className="summary-value">{defaultParams.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Entries:</span>
          <span className="summary-value">{totalCount.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Average Entries per Metric:</span>
          <span className="summary-value">{averageCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
