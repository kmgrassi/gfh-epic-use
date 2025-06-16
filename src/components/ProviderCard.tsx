import React, { useState } from "react";
import { MetricData } from "../context/types";

interface ProviderCardProps {
  title: string;
  providers: MetricData[];
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  title,
  providers,
}) => {
  const [hoveredProvider, setHoveredProvider] = useState<MetricData | null>(
    null
  );
  const isTopPerformer = title.includes("Top");

  // Sort providers based on whether they are top or low performers
  const sortedProviders = [...providers].sort((a, b) => {
    return isTopPerformer
      ? a.Value - b.Value // Ascending for top performers
      : b.Value - a.Value; // Descending for low performers
  });

  const calculateNumeratorDenominator = (provider: MetricData) => {
    return {
      numerator: provider?.Numerator?.toFixed(2),
      denominator: provider?.Denominator?.toFixed(2),
      unit: "total time (minutes)",
    };
  };

  return (
    <div className="provider-card">
      <h3 className="provider-title">{title}</h3>
      <div className="provider-list">
        {sortedProviders.map((provider, index) => {
          const { numerator, denominator, unit } =
            calculateNumeratorDenominator(provider);
          return (
            <div
              key={index}
              className="provider-item"
              onMouseEnter={() => setHoveredProvider(provider)}
              onMouseLeave={() => setHoveredProvider(null)}
            >
              <span className="provider-name">
                {provider["Clinician Name"]}
              </span>
              <span
                className={`provider-value ${
                  isTopPerformer ? "top-value" : "low-value"
                }`}
              >
                {provider.Value.toFixed(2)}
              </span>
              {hoveredProvider === provider && (
                <div
                  className={`metric-tooltip ${
                    isTopPerformer ? "right" : "left"
                  }`}
                >
                  <div className="tooltip-content">
                    <div className="tooltip-row">
                      <span className="tooltip-label">Numerator:</span>
                      <span className="tooltip-value">
                        {numerator} {unit}
                      </span>
                    </div>
                    <div className="tooltip-row">
                      <span className="tooltip-label">Denominator:</span>
                      <span className="tooltip-value">
                        {denominator}{" "}
                        {denominator === "1" ? "count" : "patients"}
                      </span>
                    </div>
                    <div className="tooltip-row">
                      <span className="tooltip-label">Metric:</span>
                      <span className="tooltip-value">{provider.Metric}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
