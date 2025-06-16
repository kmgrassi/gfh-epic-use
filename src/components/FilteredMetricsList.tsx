import { useMetrics } from "../context/MetricsContext";

export function FilteredMetricsList() {
  const { filteredMetrics, totalCount, selectedParams } = useMetrics();

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
