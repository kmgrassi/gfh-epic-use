interface MetricCount {
  metric: string;
  count: number;
  id: number;
}

interface SelectedMetricsSummaryProps {
  metrics: MetricCount[];
  selectedParams: string[];
}

export function SelectedMetricsSummary({
  metrics,
  selectedParams,
}: SelectedMetricsSummaryProps) {
  const selectedMetrics = metrics.filter((metric) =>
    selectedParams.includes(metric.metric)
  );

  const totalCount = selectedMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );
  const averageCount =
    selectedMetrics.length > 0
      ? Math.round(totalCount / selectedMetrics.length)
      : 0;

  if (selectedMetrics.length === 0) return null;

  return (
    <div className="selected-metrics-summary">
      <div className="summary-item">
        <span className="summary-label">Selected Parameters:</span>
        <span className="summary-value">{selectedMetrics.length}</span>
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
  );
}
