import { useMetrics } from "../context/MetricsContext";

export function SelectedMetricsSummary() {
  const { metrics, selectedParams } = useMetrics();

  const filteredMetrics = metrics.filter((metric) =>
    selectedParams.includes(metric.metric)
  );

  const totalCount = filteredMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );

  const averageValue =
    filteredMetrics.reduce((sum, metric) => sum + metric.averageValue, 0) /
    filteredMetrics.length;

  const averageStdDev =
    filteredMetrics.reduce((sum, metric) => sum + metric.standardDeviation, 0) /
    filteredMetrics.length;

  return (
    <div className="selected-metrics-summary">
      <div className="summary-item">
        <span className="summary-label">Total Metrics:</span>
        <span className="summary-value">{filteredMetrics.length}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Entries:</span>
        <span className="summary-value">{totalCount.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Value:</span>
        <span className="summary-value">{averageValue.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Std Dev:</span>
        <span className="summary-value">{averageStdDev.toFixed(2)}</span>
      </div>
    </div>
  );
}
