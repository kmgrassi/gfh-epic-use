import React, { useState } from "react";

import { useProviders } from "../context/ProvidersContext";
import { METRIC_TITLES } from "../context/types";
import { ProviderCard } from "./ProviderCard";

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
  } = useProviders();

  const [selectedMetric, setSelectedMetric] =
    useState<keyof typeof METRIC_TITLES>("ORDERS");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const metricLabels = {
    ORDERS: "Orders",
    IN_BASKET: "In Basket",
    DOCUMENTATION: "Documentation",
    COMMUNICATIONS: "Communications",
  };

  const getProvidersForMetric = (metric: keyof typeof METRIC_TITLES) => {
    switch (metric) {
      case "ORDERS":
        return { top: topOrders, low: lowOrders };
      case "IN_BASKET":
        return { top: topInBasket, low: lowInBasket };
      case "DOCUMENTATION":
        return { top: topDocumentation, low: lowDocumentation };
      case "COMMUNICATIONS":
        return { top: topCommunications, low: lowCommunications };
    }
  };

  const handleMetricSelect = (metric: keyof typeof METRIC_TITLES) => {
    setSelectedMetric(metric);
    setIsDropdownOpen(false);
  };

  const { top, low } = getProvidersForMetric(selectedMetric);

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
                  handleMetricSelect(key as keyof typeof METRIC_TITLES)
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="cohorts-grid">
        <ProviderCard
          title={`${metricLabels[selectedMetric]} - Top Performers`}
          providers={top}
        />
        <ProviderCard
          title={`${metricLabels[selectedMetric]} - Low Performers`}
          providers={low}
        />
      </div>
    </div>
  );
};
