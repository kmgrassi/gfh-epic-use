import { useEffect, useState } from "react";
import "./App.css";
import { ParamSelect } from "./components/ParamSelect";
import { FilteredMetricsList } from "./components/FilteredMetricsList";
import { SelectedMetricsSummary } from "./components/SelectedMetricsSummary";
import { AggregateMetricsDisplay } from "./components/AggregateMetricsDisplay";
import { getUniqueMetrics, getAggregateMetrics } from "./utils/metricParser";

interface MetricCount {
  metric: string;
  count: number;
  id: number;
  averageValue: number;
  standardDeviation: number;
}

interface AggregateMetricCount {
  metric: string;
  count: number;
}

function App() {
  const [metrics, setMetrics] = useState<MetricCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [aggregateCounts, setAggregateCounts] = useState<
    AggregateMetricCount[]
  >([]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [uniqueMetrics, aggregateMetrics] = await Promise.all([
        getUniqueMetrics(),
        getAggregateMetrics([
          "(IP) Time in In Basket per Patient per Day",
          "(IP) Time in Documentation per Patient per Day",
        ]),
      ]);
      setMetrics(uniqueMetrics);
      setAggregateCounts(aggregateMetrics.substringMatchCount);
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

        {!loading && metrics.length > 0 && (
          <AggregateMetricsDisplay aggregateCounts={aggregateCounts} />
        )}

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
