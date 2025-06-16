import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMixedProviders, getProviderCohorts } from "../utils/metricParser";
import { METRIC_TITLES, MetricData, MetricWithStats } from "./types";

interface ProvidersContextType {
  topOrders: MetricData[];
  lowOrders: MetricData[];
  topInBasket: MetricData[];
  lowInBasket: MetricData[];
  topDocumentation: MetricData[];
  lowDocumentation: MetricData[];
  topCommunications: MetricData[];
  lowCommunications: MetricData[];
  topAll: MetricData[];
  lowAll: MetricData[];
  mixedAll: MetricData[];
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(
  undefined
);

export const ProvidersProvider: React.FC<{
  children: React.ReactNode;
  metrics: MetricWithStats[];
  aggregateMetrics: MetricWithStats[];
}> = ({ children, metrics, aggregateMetrics }) => {
  const [topOrders, setTopOrders] = useState<MetricData[]>([]);
  const [lowOrders, setLowOrders] = useState<MetricData[]>([]);
  const [topInBasket, setTopInBasket] = useState<MetricData[]>([]);
  const [lowInBasket, setLowInBasket] = useState<MetricData[]>([]);
  const [topDocumentation, setTopDocumentation] = useState<MetricData[]>([]);
  const [lowDocumentation, setLowDocumentation] = useState<MetricData[]>([]);
  const [topCommunications, setTopCommunications] = useState<MetricData[]>([]);
  const [lowCommunications, setLowCommunications] = useState<MetricData[]>([]);
  const [mixedAll, setMixedAll] = useState<MetricData[]>([]);

  const updateProviderCohorts = (
    metric: MetricWithStats,
    setters: {
      setTop: (data: MetricData[]) => void;
      setLow: (data: MetricData[]) => void;
    }
  ) => {
    const { top, low } = getProviderCohorts(metric);
    setters.setTop(top);
    setters.setLow(low);
  };

  useEffect(() => {
    const allMetrics = [...metrics, ...aggregateMetrics];

    allMetrics.forEach((metric) => {
      switch (metric.metric) {
        case METRIC_TITLES.ORDERS:
          updateProviderCohorts(metric, {
            setTop: setTopOrders,
            setLow: setLowOrders,
          });
          break;
        case METRIC_TITLES.IN_BASKET:
          updateProviderCohorts(metric, {
            setTop: setTopInBasket,
            setLow: setLowInBasket,
          });
          break;
        case METRIC_TITLES.DOCUMENTATION:
          updateProviderCohorts(metric, {
            setTop: setTopDocumentation,
            setLow: setLowDocumentation,
          });
          break;
        case METRIC_TITLES.COMMUNICATIONS:
          updateProviderCohorts(metric, {
            setTop: setTopCommunications,
            setLow: setLowCommunications,
          });
          break;
      }
    });

    // Calculate mixed providers from all metrics
    const mixed = getMixedProviders(allMetrics);
    setMixedAll(mixed);
  }, [metrics, aggregateMetrics]);

  // Use useMemo to compute combined arrays only when individual arrays change
  const topAll = useMemo(() => {
    return [
      ...topOrders,
      ...topInBasket,
      ...topDocumentation,
      ...topCommunications,
    ];
  }, [topOrders, topInBasket, topDocumentation, topCommunications]);

  const lowAll = useMemo(() => {
    return [
      ...lowOrders,
      ...lowInBasket,
      ...lowDocumentation,
      ...lowCommunications,
    ];
  }, [lowOrders, lowInBasket, lowDocumentation, lowCommunications]);

  const value = {
    topOrders,
    lowOrders,
    topInBasket,
    lowInBasket,
    topDocumentation,
    lowDocumentation,
    topCommunications,
    lowCommunications,
    topAll,
    lowAll,
    mixedAll,
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
};

export const useProviders = () => {
  const context = useContext(ProvidersContext);
  if (context === undefined) {
    throw new Error("useProviders must be used within a ProvidersProvider");
  }
  return context;
};
