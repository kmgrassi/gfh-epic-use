import "./App.css";
import { FileUpload } from "./components/FileUpload";
import { ParamSelect } from "./components/ParamSelect";
import { ProviderCohorts } from "./components/ProviderCohorts";
import { SelectedMetricsSummary } from "./components/SelectedMetricsSummary";
import { MetricsProvider, useMetrics } from "./context/MetricsContext";
import { ProvidersProvider } from "./context/ProvidersContext";

function AppContent() {
  const {
    loading,
    error,
    selectedParams,
    aggregateMetrics,
    setSelectedParams,
    filteredMetrics,
    uploadData,
  } = useMetrics();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Viewer</h1>
        <FileUpload onDataUploaded={uploadData} loading={loading} />

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
              aggregateMetrics={metric}
            />
          ))}

        {!loading &&
          aggregateMetrics.length > 0 &&
          aggregateMetrics.map((aggregateMetric) => (
            <SelectedMetricsSummary
              key={aggregateMetric.metric}
              aggregateMetrics={aggregateMetric}
            />
          ))}

        {error && <p className="error">{error}</p>}
      </header>
      <ProvidersProvider
        metrics={filteredMetrics}
        aggregateMetrics={aggregateMetrics}
      >
        <ProviderCohorts />
      </ProvidersProvider>
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
