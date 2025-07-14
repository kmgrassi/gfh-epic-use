import "./App.css";
import { DataTypeHeader } from "./components/DataTypeHeader";
import { FileUpload } from "./components/FileUpload";
import { ParamSelect } from "./components/ParamSelect";
import { ProviderCohorts } from "./components/ProviderCohorts";
import { SelectedMetricsSummary } from "./components/SelectedMetricsSummary";
import { DepartmentProvider, useDepartment } from "./context/DepartmentContext";
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

  const {
    filteredMetrics: departmentFilteredMetrics,
    filteredAggregateMetrics: departmentFilteredAggregateMetrics,
  } = useDepartment();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Metrics Viewer</h1>
        <FileUpload onDataUploaded={uploadData} loading={loading} />

        {!loading &&
          (filteredMetrics.length > 0 || aggregateMetrics.length > 0) && (
            <DataTypeHeader dataType={dataType} />
          )}

        <ParamSelect
          selectedParams={selectedParams}
          onParamsChange={setSelectedParams}
        />

        {!loading &&
          aggregateMetrics.length > 0 &&
          aggregateMetrics.map((metric) => (
            <SelectedMetricsSummary
              key={metric.metric}
              aggregateMetrics={metric}
            />
          ))}

        {!loading &&
          filteredMetrics.length > 0 &&
          filteredMetrics.map((metric) => (
            <SelectedMetricsSummary
              key={metric.metric}
              aggregateMetrics={metric}
            />
          ))}

        {error && <p className="error">{error}</p>}
      </header>

      {dataType === "Inpatient" ? (
        <ProvidersProvider
          metrics={departmentFilteredMetrics}
          aggregateMetrics={departmentFilteredAggregateMetrics}
        >
          <ProviderCohorts />
        </ProvidersProvider>
      ) : (
        <OutpatientProvider
          metrics={departmentFilteredMetrics}
          aggregateMetrics={departmentFilteredAggregateMetrics}
        >
          <ProviderCohorts />
        </OutpatientProvider>
      )}
    </div>
  );
}

function AppWithDepartmentProvider() {
  const { metrics, aggregateMetrics } = useMetrics();

  return (
    <DepartmentProvider metrics={metrics} aggregateMetrics={aggregateMetrics}>
      <AppContent />
    </DepartmentProvider>
  );
}

function App() {
  return (
    <MetricsProvider>
      <AppWithDepartmentProvider />
    </MetricsProvider>
  );
}

export default App;
