import { MetricWithStats, titleMap } from "../context/types";

export function SelectedMetricsSummary({
  aggregateMetrics,
}: {
  aggregateMetrics: MetricWithStats;
}) {
  return (
    <div className="selected-metrics-summary">
      <div className="summary-item">
        <span className="summary-label">Total Metrics:</span>
        <span className="summary-value">
          {titleMap[aggregateMetrics.metric as keyof typeof titleMap] ||
            aggregateMetrics.metric}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Entries:</span>
        <span className="summary-value">
          {aggregateMetrics.count.toLocaleString()}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Value:</span>
        <span className="summary-value">
          {aggregateMetrics.averageValue.toFixed(2)}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Median Value:</span>
        <span className="summary-value">
          {aggregateMetrics.medianValue.toFixed(2)}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Std Dev:</span>
        <span className="summary-value std-dev">
          {aggregateMetrics.standardDeviation.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
