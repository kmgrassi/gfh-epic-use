import "./App.css";
import { AggregateMetricsDisplay } from "./components/AggregateMetricsDisplay";
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
  } = useMetrics();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Viewer</h1>
        <ParamSelect
          selectedParams={selectedParams}
          onParamsChange={setSelectedParams}
        />

        {!loading && metrics.length > 0 && (
          <AggregateMetricsDisplay aggregateCounts={aggregateCounts} />
        )}

        {!loading && metrics.length > 0 && selectedParams.length > 0 && (
          <SelectedMetricsSummary />
        )}

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
