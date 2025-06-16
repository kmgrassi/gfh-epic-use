import React from "react";
import { AggregateMetricCount } from "../context/types";

interface AggregateMetricsDisplayProps {
  aggregateCounts: AggregateMetricCount[];
}

const titleMap = {
  "(IP) Time in Communications per Patient per Day": "Communications",
  "(IP) Time in Orders per Patient per Day": "Orders",
  "(IP) Time in In Basket per Patient per Day": "In Basket",
  "(IP) Time in Documentation per Patient per Day": "Documentation",
};

export const AggregateMetricsDisplay: React.FC<
  AggregateMetricsDisplayProps
> = ({ aggregateCounts }) => {
  return (
    <div className="aggregate-metrics">
      <h2>Aggregate Metrics</h2>
      <div className="aggregate-metrics-grid">
        {aggregateCounts.map((count) => (
          <div key={count.metric} className="aggregate-metric-item">
            <h3>
              {titleMap[count?.metric as keyof typeof titleMap] || count.metric}
            </h3>
            <div className="metric-stats">
              <div className="metric-count">Count: {count.count}</div>
              <div className="metric-value">
                Average: {count.averageValue.toFixed(2)}
              </div>
              <div className="metric-std-dev">
                Std Dev: {count.standardDeviation.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
