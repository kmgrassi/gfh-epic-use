import "./App.css";
import { FilteredMetricsList } from "./components/FilteredMetricsList";
import { ParamSelect } from "./components/ParamSelect";
import { SelectedMetricsSummary } from "./components/SelectedMetricsSummary";
import { MetricsProvider, useMetrics } from "./context/MetricsContext";

function AppContent() {
  const {
    metrics,
    loading,
    error,
    selectedParams,
    aggregateCounts,
    setSelectedParams,
    filteredMetrics,
  } = useMetrics();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Viewer</h1>
        <ParamSelect
          selectedParams={selectedParams}
          onParamsChange={setSelectedParams}
        />
        {/* 
        {!loading && metrics.length > 0 && (
          <AggregateMetricsDisplay aggregateCounts={aggregateCounts} />
        )} */}
        {!loading &&
          filteredMetrics.length > 0 &&
          filteredMetrics.map((metric) => (
            <SelectedMetricsSummary
              key={metric.metric}
              aggregateCounts={metric}
            />
          ))}

        {!loading &&
          aggregateCounts.length > 0 &&
          aggregateCounts.map((aggregateCount) => (
            <SelectedMetricsSummary
              key={aggregateCount.metric}
              aggregateCounts={aggregateCount}
            />
          ))}

        {error && <p className="error">{error}</p>}

        {loading ? (
          <div className="loading-indicator">Loading metrics...</div>
        ) : (
          metrics.length > 0 && <FilteredMetricsList />
        )}
      </header>
    </div>
  );
}

function App() {
  return (
    <MetricsProvider>
      <AppContent />
    </MetricsProvider>
  );
}

export default App;
