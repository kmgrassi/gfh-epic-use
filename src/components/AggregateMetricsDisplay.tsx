import React from "react";

interface AggregateMetricCount {
  metric: string;
  count: number;
}

interface AggregateMetricsDisplayProps {
  aggregateCounts: AggregateMetricCount[];
}

export const AggregateMetricsDisplay: React.FC<
  AggregateMetricsDisplayProps
> = ({ aggregateCounts }) => {
  if (!aggregateCounts.length) return null;

  return (
    <div className="aggregate-metrics">
      <h3>Aggregate Metrics</h3>
      <div className="aggregate-metrics-grid">
        {aggregateCounts.map(({ metric, count }) => (
          <div key={metric} className="aggregate-metric-card">
            <div className="metric-name">{metric}</div>
            <div className="metric-count">{count.toLocaleString()} matches</div>
          </div>
        ))}
      </div>
    </div>
  );
};
