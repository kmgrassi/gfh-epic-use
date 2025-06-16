import { AggregateMetricCount } from "../context/types";

const titleMap = {
  "(IP) Time in Communications per Patient per Day": "Communications",
  "(IP) Time in Orders per Patient per Day": "Orders",
  "(IP) Time in In Basket per Patient per Day": "In Basket",
  "(IP) Time in Documentation per Patient per Day": "Documentation",
};

export function SelectedMetricsSummary({
  aggregateCounts,
}: {
  aggregateCounts: AggregateMetricCount;
}) {
  return (
    <div className="selected-metrics-summary">
      <div className="summary-item">
        <span className="summary-label">Total Metrics:</span>
        <span className="summary-value">
          {titleMap[aggregateCounts.metric as keyof typeof titleMap] ||
            aggregateCounts.metric}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Entries:</span>
        <span className="summary-value">
          {aggregateCounts.count.toLocaleString()}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Value:</span>
        <span className="summary-value">
          {aggregateCounts.averageValue.toFixed(2)}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Std Dev:</span>
        <span className="summary-value">
          {aggregateCounts.standardDeviation.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
