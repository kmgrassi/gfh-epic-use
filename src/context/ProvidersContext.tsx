import React, {
  createContext,
  useCallback,
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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFiltering: boolean;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(
  undefined
);

export const ProvidersProvider: React.FC<{
  children: React.ReactNode;
  metrics: MetricWithStats[];
  aggregateMetrics: MetricWithStats[];
}> = ({ children, metrics, aggregateMetrics }) => {
  // Pre-calculated provider lists (calculated once on data change)
  const [allProviders, setAllProviders] = useState<{
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
  }>({
    topOrders: [],
    lowOrders: [],
    topInBasket: [],
    lowInBasket: [],
    topDocumentation: [],
    lowDocumentation: [],
    topCommunications: [],
    lowCommunications: [],
    topAll: [],
    lowAll: [],
    mixedAll: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Pre-calculate all provider lists when metrics change
  useEffect(() => {
    const allMetrics = [...metrics, ...aggregateMetrics];

    // Initialize arrays
    let topOrders: MetricData[] = [];
    let lowOrders: MetricData[] = [];
    let topInBasket: MetricData[] = [];
    let lowInBasket: MetricData[] = [];
    let topDocumentation: MetricData[] = [];
    let lowDocumentation: MetricData[] = [];
    let topCommunications: MetricData[] = [];
    let lowCommunications: MetricData[] = [];

    // Calculate provider cohorts for each metric
    allMetrics.forEach((metric) => {
      const { top, low } = getProviderCohorts(metric);

      switch (metric.metric) {
        case METRIC_TITLES.ORDERS:
          topOrders = top;
          lowOrders = low;
          break;
        case METRIC_TITLES.IN_BASKET:
          topInBasket = top;
          lowInBasket = low;
          break;
        case METRIC_TITLES.DOCUMENTATION:
          topDocumentation = top;
          lowDocumentation = low;
          break;
        case METRIC_TITLES.COMMUNICATIONS:
          topCommunications = top;
          lowCommunications = low;
          break;
      }
    });

    // Calculate combined arrays
    const topAll = [
      ...topOrders,
      ...topInBasket,
      ...topDocumentation,
      ...topCommunications,
    ];

    const lowAll = [
      ...lowOrders,
      ...lowInBasket,
      ...lowDocumentation,
      ...lowCommunications,
    ];

    // Calculate mixed providers
    const mixedAll = getMixedProviders(allMetrics);

    // Store all pre-calculated lists
    setAllProviders({
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
    });
  }, [metrics, aggregateMetrics]);

  // Simple filter function - no complex calculations
  const filterProvidersByName = useCallback(
    (providers: MetricData[]): MetricData[] => {
      if (!searchTerm.trim()) return providers;

      const searchLower = searchTerm.toLowerCase();
      return providers.filter((provider) => {
        const name = provider["Clinician Name"] || "";
        return name.toLowerCase().includes(searchLower);
      });
    },
    [searchTerm]
  );

  // Track filtering state when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsFiltering(true);
      // Use a small timeout to show the filtering state
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsFiltering(false);
    }
  }, [searchTerm]);

  // Apply simple filtering to pre-calculated lists
  const filteredTopOrders = useMemo(
    () => filterProvidersByName(allProviders.topOrders),
    [filterProvidersByName, allProviders.topOrders]
  );
  const filteredLowOrders = useMemo(
    () => filterProvidersByName(allProviders.lowOrders),
    [filterProvidersByName, allProviders.lowOrders]
  );
  const filteredTopInBasket = useMemo(
    () => filterProvidersByName(allProviders.topInBasket),
    [filterProvidersByName, allProviders.topInBasket]
  );
  const filteredLowInBasket = useMemo(
    () => filterProvidersByName(allProviders.lowInBasket),
    [filterProvidersByName, allProviders.lowInBasket]
  );
  const filteredTopDocumentation = useMemo(
    () => filterProvidersByName(allProviders.topDocumentation),
    [filterProvidersByName, allProviders.topDocumentation]
  );
  const filteredLowDocumentation = useMemo(
    () => filterProvidersByName(allProviders.lowDocumentation),
    [filterProvidersByName, allProviders.lowDocumentation]
  );
  const filteredTopCommunications = useMemo(
    () => filterProvidersByName(allProviders.topCommunications),
    [filterProvidersByName, allProviders.topCommunications]
  );
  const filteredLowCommunications = useMemo(
    () => filterProvidersByName(allProviders.lowCommunications),
    [filterProvidersByName, allProviders.lowCommunications]
  );
  const filteredTopAll = useMemo(
    () => filterProvidersByName(allProviders.topAll),
    [filterProvidersByName, allProviders.topAll]
  );
  const filteredLowAll = useMemo(
    () => filterProvidersByName(allProviders.lowAll),
    [filterProvidersByName, allProviders.lowAll]
  );
  const filteredMixedAll = useMemo(
    () => filterProvidersByName(allProviders.mixedAll),
    [filterProvidersByName, allProviders.mixedAll]
  );

  const value = {
    topOrders: filteredTopOrders,
    lowOrders: filteredLowOrders,
    topInBasket: filteredTopInBasket,
    lowInBasket: filteredLowInBasket,
    topDocumentation: filteredTopDocumentation,
    lowDocumentation: filteredLowDocumentation,
    topCommunications: filteredTopCommunications,
    lowCommunications: filteredLowCommunications,
    topAll: filteredTopAll,
    lowAll: filteredLowAll,
    mixedAll: filteredMixedAll,
    searchTerm,
    setSearchTerm,
    isFiltering,
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
