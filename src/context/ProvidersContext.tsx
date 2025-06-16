import React, { createContext, useContext, useEffect, useState } from "react";
import { getProviderCohorts } from "../utils/metricParser";
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
  }, [metrics, aggregateMetrics]);

  const value = {
    topOrders,
    lowOrders,
    topInBasket,
    lowInBasket,
    topDocumentation,
    lowDocumentation,
    topCommunications,
    lowCommunications,
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
