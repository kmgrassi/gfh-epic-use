import React from "react";

import { useProviders } from "../context/ProvidersContext";
import { MetricData } from "../context/types";

const ProviderCard: React.FC<{ title: string; providers: MetricData[] }> = ({
  title,
  providers,
}) => {
  const isTopPerformer = title.includes("Top");

  // Sort providers based on whether they are top or low performers
  const sortedProviders = [...providers].sort((a, b) => {
    return isTopPerformer
      ? a.Value - b.Value // Descending for top performers
      : b.Value - a.Value; // Ascending for low performers
  });

  return (
    <div className="provider-card">
      <h3>{title}</h3>
      <div className="provider-list">
        {sortedProviders.map((provider, index) => (
          <div key={index} className="provider-item">
            <span className="provider-name">{provider["Clinician Name"]}</span>
            <span
              className={`provider-value ${
                isTopPerformer ? "top-value" : "low-value"
              }`}
            >
              {provider.Value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  return (
    <div className="provider-cohorts">
      <div className="cohorts-grid">
        <React.Fragment>
          <ProviderCard
            title={`Orders - Top Performers`}
            providers={topOrders}
          />
          <ProviderCard
            title={`Orders - Low Performers`}
            providers={lowOrders}
          />
        </React.Fragment>

        {/* {topInBasket.map((inBasket) => (
          <React.Fragment key={inBasket.Metric}>
            <ProviderCard
              title={`${inBasket.Metric} - Top Performers`}
              providers={inBasket.topProviders}
            />
            <ProviderCard
              title={`${inBasket.Metric} - Low Performers`}
              providers={inBasket.lowProviders}
            />
          </React.Fragment>
        ))} */}
      </div>
    </div>
  );
};
