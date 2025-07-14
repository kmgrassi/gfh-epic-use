import React, { useState } from "react";

import { useMetrics } from "../context/MetricsContext";
import { METRIC_TITLES, OUTPATIENT_METRIC_TITLES } from "../context/types";
import { ProviderCard } from "./ProviderCard";
import { ProviderCardAll } from "./ProviderCardAll";
import { ProviderCardMixed } from "./ProviderCardMixed";
import { ProviderSearch } from "./ProviderSearch";

// Wrapper components to handle context availability
const InpatientProviderCohorts: React.FC = () => {
  const { useProviders } = require("../context/ProvidersContext");
  const providersContext = useProviders();
  return (
    <ProviderCohortsContent
      providersContext={providersContext}
      metricTitles={METRIC_TITLES}
    />
  );
};

const OutpatientProviderCohorts: React.FC = () => {
  const { useOutpatient } = require("../context/OutpatientContext");
  const providersContext = useOutpatient();
  return (
    <ProviderCohortsContent
      providersContext={providersContext}
      metricTitles={OUTPATIENT_METRIC_TITLES}
    />
  );
};

interface ProviderCohortsContentProps {
  providersContext: any;
  metricTitles: typeof METRIC_TITLES | typeof OUTPATIENT_METRIC_TITLES;
}

const ProviderCohortsContent: React.FC<ProviderCohortsContentProps> = ({
  providersContext,
  metricTitles,
}) => {
  const { metrics, aggregateMetrics } = useMetrics();

  const {
    topOrders,
    topInBasket,
    topDocumentation,
    topCommunications,
    lowOrders,
    lowInBasket,
    lowDocumentation,
    lowCommunications,
    topAll,
    lowAll,
    mixedAll,
    searchTerm,
    setSearchTerm,
    isFiltering,
  } = providersContext;

  const [selectedMetric, setSelectedMetric] = useState<
    keyof typeof metricTitles | "ALL" | "MIXED"
  >("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const metricLabels = {
    ALL: "All",
    MIXED: "Mixed",
    ORDERS: "Orders",
    IN_BASKET: "In Basket",
    DOCUMENTATION: "Documentation",
    COMMUNICATIONS: "Communications",
  };

  const getProvidersForMetric = (
    metric: keyof typeof metricTitles | "ALL" | "MIXED"
  ) => {
    switch (metric) {
      case "ALL":
        return { top: topAll, low: lowAll, mixed: [] };
      case "MIXED":
        return { top: [], low: [], mixed: mixedAll };
      case "ORDERS":
        return { top: topOrders, low: lowOrders, mixed: [] };
      case "IN_BASKET":
        return { top: topInBasket, low: lowInBasket, mixed: [] };
      case "DOCUMENTATION":
        return { top: topDocumentation, low: lowDocumentation, mixed: [] };
      case "COMMUNICATIONS":
        return { top: topCommunications, low: lowCommunications, mixed: [] };
    }
  };

  const handleMetricSelect = async (
    metric: keyof typeof metricTitles | "ALL" | "MIXED"
  ) => {
    setIsLoading(true);
    setSelectedMetric(metric);
    setIsDropdownOpen(false);

    // Add a small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsLoading(false);
  };

  const { top, low, mixed } = getProvidersForMetric(selectedMetric);

  return (
    <div className="provider-cohorts">
      <div className="metric-selector">
        <button
          className={`dropdown-button ${isLoading ? "loading" : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Loading...
            </>
          ) : (
            <>
              {metricLabels[selectedMetric]} Metrics
              <span
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              >
                ▼
              </span>
            </>
          )}
        </button>
        {isDropdownOpen && !isLoading && (
          <div className="dropdown-menu">
            {Object.entries(metricLabels).map(([key, label]) => (
              <button
                key={key}
                className={`dropdown-item ${
                  selectedMetric === key ? "selected" : ""
                }`}
                onClick={() =>
                  handleMetricSelect(
                    key as keyof typeof metricTitles | "ALL" | "MIXED"
                  )
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ProviderSearch
        onSearchChange={setSearchTerm}
        placeholder="Search providers by first or last name..."
        isFiltering={isFiltering}
      />

      <div
        className={`cohorts-grid ${
          selectedMetric === "MIXED" ? "centered" : ""
        }`}
      >
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>Loading providers...</p>
          </div>
        ) : selectedMetric === "ALL" ? (
          <>
            <ProviderCardAll
              title={`${metricLabels[selectedMetric]} - Top Performers`}
              providers={top}
              metricTitles={metricTitles}
            />
            <ProviderCardAll
              title={`${metricLabels[selectedMetric]} - Low Performers`}
              providers={low}
              metricTitles={metricTitles}
            />
          </>
        ) : selectedMetric === "MIXED" ? (
          <ProviderCardMixed
            title={`${metricLabels[selectedMetric]} Performers`}
            providers={mixed}
            allMetrics={[...metrics, ...aggregateMetrics]}
            metricTitles={metricTitles}
          />
        ) : (
          <>
            <ProviderCard
              title={`${metricLabels[selectedMetric]} - Top Performers`}
              providers={top}
            />
            <ProviderCard
              title={`${metricLabels[selectedMetric]} - Low Performers`}
              providers={low}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Main component that determines which wrapper to use
export const ProviderCohorts: React.FC = () => {
  const { dataType } = useMetrics();

  if (dataType === "Inpatient") {
    return <InpatientProviderCohorts />;
  } else {
    return <OutpatientProviderCohorts />;
  }
};
