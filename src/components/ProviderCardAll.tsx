import React, { useEffect, useState } from "react";
import { MetricData } from "../context/types";

interface ProviderCardAllProps {
  title: string;
  providers: MetricData[];
}

export const ProviderCardAll: React.FC<ProviderCardAllProps> = ({
  title,
  providers,
}) => {
  const [groupedProviders, setGroupedProviders] = useState<
    Record<string, MetricData[]>
  >({});
  const [hoveredProvider, setHoveredProvider] = useState<MetricData | null>(
    null
  );
  const isTopPerformer = title.includes("Top");

  useEffect(() => {
    const grouped = providers.reduce((acc, provider) => {
      const name = provider["Clinician Name"];
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(provider);
      return acc;
    }, {} as Record<string, MetricData[]>);
    setGroupedProviders(grouped);
  }, [providers]);

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
        {Object.entries(groupedProviders).map(([name, providerMetrics]) => (
          <div
            key={name}
            className="provider-item-all"
            onMouseEnter={() => setHoveredProvider(providerMetrics[0])}
            onMouseLeave={() => setHoveredProvider(null)}
          >
            <span className="provider-name">{name}</span>
            <div className="provider-metrics">
              {providerMetrics.map((provider) => {
                const { numerator, denominator, unit } =
                  calculateNumeratorDenominator(provider);
                return (
                  <div key={provider.Metric} className="provider-metric">
                    <span className="metric-name">
                      {provider.Metric.replace("(IP) ", "")}
                    </span>
                    <span
                      className={`provider-value ${
                        isTopPerformer ? "top-value" : "low-value"
                      }`}
                    >
                      {provider.Value.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            {hoveredProvider && hoveredProvider["Clinician Name"] === name && (
              <div
                className={`metric-tooltip ${
                  isTopPerformer ? "right" : "left"
                }`}
              >
                <div className="tooltip-content">
                  {providerMetrics.map((provider) => {
                    const { numerator, denominator, unit } =
                      calculateNumeratorDenominator(provider);
                    return (
                      <React.Fragment key={provider.Metric}>
                        <div className="tooltip-row">
                          <span className="tooltip-label">Metric:</span>
                          <span className="tooltip-value">
                            {provider.Metric}
                          </span>
                        </div>
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
                        <div className="tooltip-divider" />
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
