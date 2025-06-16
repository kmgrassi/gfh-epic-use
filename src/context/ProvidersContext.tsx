import { createContext, useContext, useEffect, useState } from "react";
import { getProviderCohorts } from "../utils/metricParser";
import { possibleParams } from "./MetricsContext";
import { MetricData, MetricWithStats } from "./types";

interface ProvidersContextType {
  topOrders: MetricData[];
  topInBasket: MetricData[];
  topDocumentation: MetricData[];
  topCommunications: MetricData[];
  lowOrders: MetricData[];
  lowInBasket: MetricData[];
  lowDocumentation: MetricData[];
  lowCommunications: MetricData[];
}

export const ProvidersContext = createContext<ProvidersContextType | undefined>(
  undefined
);

export const ProvidersProvider = ({
  metrics,
  aggregateMetrics,
  children,
}: {
  metrics: MetricWithStats[];
  aggregateMetrics: MetricWithStats[];
  children: React.ReactNode;
}) => {
  console.log("metrics", metrics);
  console.log("aggregateMetrics", aggregateMetrics);

  const [topOrders, setTopOrders] = useState<MetricData[]>([]);
  const [topInBasket, setTopInBasket] = useState<MetricData[]>([]);
  const [topDocumentation, setTopDocumentation] = useState<MetricData[]>([]);
  const [topCommunications, setTopCommunications] = useState<MetricData[]>([]);

  const [lowOrders, setLowOrders] = useState<MetricData[]>([]);
  const [lowInBasket, setLowInBasket] = useState<MetricData[]>([]);
  const [lowDocumentation, setLowDocumentation] = useState<MetricData[]>([]);
  const [lowCommunications, setLowCommunications] = useState<MetricData[]>([]);

  useEffect(() => {
    possibleParams.forEach((param) => {
      const { title } = param;

      if (title === "(IP) Time in Orders per Patient per Day") {
        const foundOrdersMetrics = metrics.find(
          (item) => item.metric === title
        );
        if (!foundOrdersMetrics) return;
        const topLow = getProviderCohorts(foundOrdersMetrics);
        setTopOrders(topLow.top);
        setLowOrders(topLow.low);
      } else if (title === "(IP) Time in In Basket per Patient per Day") {
        setTopInBasket(metrics.map((m) => m.values).flat());
      } else if (title === "(IP) Time in Documentation per Patient per Day") {
        setTopDocumentation(metrics.map((m) => m.values).flat());
      } else if (title === "(IP) Time in Communications per Patient per Day") {
        setTopCommunications(metrics.map((m) => m.values).flat());
      }
    });
  }, [aggregateMetrics, metrics]);

  return (
    <ProvidersContext.Provider
      value={{
        topOrders,
        topInBasket,
        topDocumentation,
        topCommunications,
        lowOrders,
        lowInBasket,
        lowDocumentation,
        lowCommunications,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};

export const useProviders = () => {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error("useProviders must be used within a ProvidersProvider");
  }
  return context;
};
