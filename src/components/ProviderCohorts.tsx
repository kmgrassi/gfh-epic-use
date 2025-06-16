import React, { useState } from "react";

import { useMetrics } from "../context/MetricsContext";
import { useProviders } from "../context/ProvidersContext";
import { METRIC_TITLES } from "../context/types";
import { ProviderCard } from "./ProviderCard";
import { ProviderCardAll } from "./ProviderCardAll";
import { ProviderCardMixed } from "./ProviderCardMixed";

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
  } = useProviders();

  const { metrics, aggregateMetrics } = useMetrics();

  const [selectedMetric, setSelectedMetric] = useState<
    keyof typeof METRIC_TITLES | "ALL" | "MIXED"
  >("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleMetricSelect = (
    metric: keyof typeof METRIC_TITLES | "ALL" | "MIXED"
  ) => {
    setSelectedMetric(metric);
    setIsDropdownOpen(false);
  };

  const { top, low, mixed } = getProvidersForMetric(selectedMetric);

  return (
    <div className="provider-cohorts">
      <div className="metric-selector">
        <button
          className="dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {metricLabels[selectedMetric]} Metrics
          <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
            ▼
          </span>
        </button>
        {isDropdownOpen && (
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
      <div className={`cohorts-grid ${selectedMetric === "MIXED" ? "centered" : ""}`}>
        {selectedMetric === "ALL" ? (
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
