import "./App.css";
import { DataTypeHeader } from "./components/DataTypeHeader";
import { FileUpload } from "./components/FileUpload";
import { ParamSelect } from "./components/ParamSelect";
import { ProviderCohorts } from "./components/ProviderCohorts";
import { SelectedMetricsSummary } from "./components/SelectedMetricsSummary";
import { MetricsProvider, useMetrics } from "./context/MetricsContext";
import { OutpatientProvider } from "./context/OutpatientContext";
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
    dataType,
  } = useMetrics();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Viewer</h1>
        <FileUpload onDataUploaded={uploadData} loading={loading} />

        {!loading &&
          ((dataType === "Outpatient"
            ? [...filteredMetrics, ...aggregateMetrics]
            : filteredMetrics
          ).length > 0 ||
            (dataType === "Inpatient" && aggregateMetrics.length > 0)) && (
            <DataTypeHeader dataType={dataType} />
          )}

        <ParamSelect
          selectedParams={selectedParams}
          onParamsChange={setSelectedParams}
        />
        {/* 
        {!loading && metrics.length > 0 && (
          <AggregateMetricsDisplay aggregateCounts={aggregateCounts} />
        )} */}
        {!loading &&
          (dataType === "Outpatient"
            ? [...filteredMetrics, ...aggregateMetrics]
            : filteredMetrics
          ).length > 0 &&
          (dataType === "Outpatient"
            ? [...filteredMetrics, ...aggregateMetrics]
            : filteredMetrics
          ).map((metric) => (
            <SelectedMetricsSummary
              key={metric.metric}
              aggregateMetrics={metric}
            />
          ))}

        {!loading &&
          dataType === "Inpatient" &&
          aggregateMetrics.length > 0 &&
          aggregateMetrics.map((aggregateMetric) => (
            <SelectedMetricsSummary
              key={aggregateMetric.metric}
              aggregateMetrics={aggregateMetric}
            />
          ))}

        {error && <p className="error">{error}</p>}
      </header>

      {dataType === "Inpatient" ? (
        <ProvidersProvider
          metrics={filteredMetrics}
          aggregateMetrics={aggregateMetrics}
        >
          <ProviderCohorts />
        </ProvidersProvider>
      ) : (
        <OutpatientProvider
          metrics={filteredMetrics}
          aggregateMetrics={aggregateMetrics}
        >
          <ProviderCohorts />
        </OutpatientProvider>
      )}
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
