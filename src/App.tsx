import { useEffect, useState } from "react";
import "./App.css";
import { ParamSelect } from "./ParamSelect";
import { FilteredMetricsList } from "./components/FilteredMetricsList";
import { SelectedMetricsSummary } from "./components/SelectedMetricsSummary";
import { getUniqueMetrics } from "./utils/metricParser";

interface MetricCount {
  metric: string;
  count: number;
  id: number;
  averageValue: number;
  standardDeviation: number;
}

function App() {
  const [metrics, setMetrics] = useState<MetricCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const uniqueMetrics = await getUniqueMetrics();
      setMetrics(uniqueMetrics);
    } catch (err) {
      setError("Failed to fetch metrics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleParamsChange = (newParams: string[]) => {
    setSelectedParams(newParams);
  };

  const filteredMetrics =
    selectedParams.length > 0
      ? metrics.filter((metric) => selectedParams.includes(metric.metric))
      : metrics;

  const totalCount = filteredMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Viewer</h1>
        <ParamSelect
          selectedParams={selectedParams}
          onParamsChange={handleParamsChange}
        />

        {!loading && metrics.length > 0 && selectedParams.length > 0 && (
          <SelectedMetricsSummary
            metrics={metrics}
            selectedParams={selectedParams}
          />
        )}

        {error && <p className="error">{error}</p>}

        {loading ? (
          <div className="loading-indicator">Loading metrics...</div>
        ) : (
          metrics.length > 0 && (
            <FilteredMetricsList
              metrics={metrics}
              selectedParams={selectedParams}
            />
          )
        )}
      </header>
    </div>
  );
}

export default App;
