import React, { useEffect, useState } from "react";
import { MetricData, titleMap } from "../context/types";

interface ProviderCardAllProps {
  title: string;
  providers: MetricData[];
  metricTitles: {
    ORDERS: string;
    IN_BASKET: string;
    DOCUMENTATION: string;
    COMMUNICATIONS: string;
  };
}

export const ProviderCardAll: React.FC<ProviderCardAllProps> = ({
  title,
  providers,
  metricTitles,
}) => {
  const [groupedProviders, setGroupedProviders] = useState<
    Record<string, MetricData[]>
  >({});

  const isTopPerformer = title.includes("Top");

  const METRIC_ORDER = [
    metricTitles.ORDERS,
    metricTitles.IN_BASKET,
    metricTitles.DOCUMENTATION,
    metricTitles.COMMUNICATIONS,
  ];

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

  const getMetricForType = (
    providerMetrics: MetricData[],
    metricType: string
  ) => {
    return providerMetrics.find((p) => p.Metric === metricType) || null;
  };

  const hasMetricCount = (providerMetrics: MetricData[]) => {
    let count = 0;
    for (const metric of providerMetrics) {
      if (metric.Value !== 0) {
        count++;
      }
    }
    return count > 1;
  };

  return (
    <div className="provider-card">
      <h3 className="provider-title">{title}</h3>
      <div className="provider-list">
        {Object.entries(groupedProviders)
          .filter(([_, providerMetrics]) => hasMetricCount(providerMetrics))
          .map(([name, providerMetrics]) => (
            <div key={name} className="provider-item-all">
              <span className="provider-name">{name}</span>
              <div className="provider-metrics">
                {METRIC_ORDER.map((metricType) => {
                  const provider = getMetricForType(
                    providerMetrics,
                    metricType
                  );
                  return (
                    <div key={metricType} className="provider-metric">
                      <span className="metric-name">
                        {titleMap[metricType as keyof typeof titleMap] ||
                          metricType}
                      </span>
                      <span
                        className={`provider-value ${
                          isTopPerformer ? "top-value" : "low-value"
                        }`}
                      >
                        {provider?.Value.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
