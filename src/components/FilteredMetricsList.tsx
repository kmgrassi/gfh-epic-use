import React from "react";

interface MetricCount {
  metric: string;
  count: number;
  id: number;
  averageValue: number;
  standardDeviation: number;
}

interface FilteredMetricsListProps {
  metrics: MetricCount[];
  selectedParams: string[];
}

export function FilteredMetricsList({
  metrics,
  selectedParams,
}: FilteredMetricsListProps) {
  const filteredMetrics =
    selectedParams.length > 0
      ? metrics.filter((metric) => selectedParams.includes(metric.metric))
      : metrics;

  const totalCount = filteredMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );

  return (
    <div className="metrics-container">
      <h2>Metrics {selectedParams.length > 0 ? "(Filtered)" : ""}:</h2>
      <div className="metrics-count">
        Showing {filteredMetrics.length} metrics with{" "}
        {totalCount.toLocaleString()} total entries
      </div>
      <ul>
        {filteredMetrics.slice(0, 100).map((metric, index) => (
          <li key={index} className="metric-item">
            <div className="metric-info">
              <span className="metric-id">ID: {metric.id}</span>
              <span className="metric-name">{metric.metric}</span>
            </div>
            <div className="metric-stats">
              <span className="metric-count">
                ({metric?.count?.toLocaleString()} entries)
              </span>
              <span className="metric-value">
                Avg: {metric?.averageValue?.toFixed(2)}
                <span className="metric-std-dev">
                  (±{metric?.standardDeviation?.toFixed(2)})
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
