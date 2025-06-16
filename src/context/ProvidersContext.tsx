import { createContext, useState } from "react";
import { MetricCount } from "./types";

interface ProvidersContextType {
  topProvidersInAll: { clinicianName: string; metrics: MetricCount[] }[];
  lowPerformersInAll: { clinicianName: string; metrics: MetricCount[] }[];
  mixedProvidersInAll: { clinicianName: string; metrics: MetricCount[] }[];
}

export const ProvidersContext = createContext<ProvidersContextType | undefined>(
  undefined
);

export const ProvidersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [topProvidersInAll, setTopProvidersInAll] = useState<
    { clinicianName: string; metrics: MetricCount[] }[]
  >([]);

  const [lowPerformersInAll, setLowPerformersInAll] = useState<
    { clinicianName: string; metrics: MetricCount[] }[]
  >([]);

  const [mixedProvidersInAll, setMixedProvidersInAll] = useState<
    { clinicianName: string; metrics: MetricCount[] }[]
  >([]);

  return (
    <ProvidersContext.Provider
      value={{
        topProvidersInAll,
        lowPerformersInAll,
        mixedProvidersInAll,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};
