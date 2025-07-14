import React, { useState } from "react";

import { useMetrics } from "../context/MetricsContext";
import { useProviders } from "../context/ProvidersContext";
import { METRIC_TITLES } from "../context/types";
import { ProviderCard } from "./ProviderCard";
import { ProviderCardAll } from "./ProviderCardAll";
import { ProviderCardMixed } from "./ProviderCardMixed";
import { ProviderSearch } from "./ProviderSearch";

export const ProviderCohorts: React.FC = () => {
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

    setSearchTerm,
    isFiltering,
  } = useProviders();

  const { metrics, aggregateMetrics } = useMetrics();

  const [selectedMetric, setSelectedMetric] = useState<
    keyof typeof METRIC_TITLES | "ALL" | "MIXED"
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
    metric: keyof typeof METRIC_TITLES | "ALL" | "MIXED"
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
    metric: keyof typeof METRIC_TITLES | "ALL" | "MIXED"
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
                    key as keyof typeof METRIC_TITLES | "ALL" | "MIXED"
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
            />
            <ProviderCardAll
              title={`${metricLabels[selectedMetric]} - Low Performers`}
              providers={low}
            />
          </>
        ) : selectedMetric === "MIXED" ? (
          <ProviderCardMixed
            title={`${metricLabels[selectedMetric]} Performers`}
            providers={mixed}
            allMetrics={[...metrics, ...aggregateMetrics]}
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
