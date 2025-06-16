import React, { useEffect, useState } from "react";
import { METRIC_TITLES, MetricData, titleMap } from "../context/types";
import { MetricWithStats } from "../context/types";

interface ProviderCardMixedProps {
  title: string;
  providers: MetricData[];
  allMetrics: MetricWithStats[];
}

const METRIC_ORDER = [
  METRIC_TITLES.ORDERS,
  METRIC_TITLES.IN_BASKET,
  METRIC_TITLES.DOCUMENTATION,
  METRIC_TITLES.COMMUNICATIONS,
];

export const ProviderCardMixed: React.FC<ProviderCardMixedProps> = ({
  title,
  providers,
  allMetrics,
}) => {
  const [groupedProviders, setGroupedProviders] = useState<
    Record<string, MetricData[]>
  >({});

  useEffect(() => {
    // Group providers by name and collect all their metrics
    const grouped = providers.reduce((acc, provider) => {
      const name = provider["Clinician Name"];
      const providerKey = `${provider["EMP CID"]}-${provider["SER CID"]}`;
      
      if (!acc[name]) {
        acc[name] = [];
      }
      
      // Find all metrics for this provider across all metric types
      allMetrics.forEach((metric) => {
        const providerMetric = metric.values.find(
          (v) => `${v["EMP CID"]}-${v["SER CID"]}` === providerKey
        );
        if (providerMetric) {
          acc[name].push(providerMetric);
        }
      });
      
      return acc;
    }, {} as Record<string, MetricData[]>);
    
    setGroupedProviders(grouped);
  }, [providers, allMetrics]);

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

  const getMetricClass = (provider: MetricData | null, metricType: string) => {
    if (!provider) return "";
    
    // Find the corresponding metric stats to determine if this is top or low performance
    const metricStats = allMetrics.find((m) => m.metric === metricType);
    if (!metricStats) return "";
    
    const useMedian = metricStats.averageValue > metricStats.medianValue;
    const threshold = useMedian ? metricStats.medianValue : metricStats.averageValue;
    
    return provider.Value < threshold ? "top-value" : "low-value";
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
                        className={`provider-value ${getMetricClass(provider, metricType)}`}
                      >
                        {provider?.Value.toFixed(2) || "N/A"}
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