import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMixedProviders, getProviderCohorts } from "../utils/metricParser";
import { MetricData, MetricWithStats, OUTPATIENT_METRIC_TITLES } from "./types";

interface OutpatientContextType {
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

const OutpatientContext = createContext<OutpatientContextType | undefined>(
  undefined
);

export const OutpatientProvider: React.FC<{
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

      // Use exact matching for most metrics, but handle aggregated metrics
      if (metric.metric === OUTPATIENT_METRIC_TITLES.ORDERS) {
        topOrders = top;
        lowOrders = low;
      } else if (metric.metric === "In Basket") {
        // This is the aggregated In Basket metric (average of all In Basket subcategories)
        topInBasket = top;
        lowInBasket = low;
      } else if (metric.metric === "Notes") {
        // This is the aggregated Notes metric (average of all Notes subcategories)
        topDocumentation = top;
        lowDocumentation = low;
      } else if (metric.metric === OUTPATIENT_METRIC_TITLES.COMMUNICATIONS) {
        topCommunications = top;
        lowCommunications = low;
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
    <OutpatientContext.Provider value={value}>
      {children}
    </OutpatientContext.Provider>
  );
};

export const useOutpatient = () => {
  const context = useContext(OutpatientContext);
  if (context === undefined) {
    throw new Error("useOutpatient must be used within an OutpatientProvider");
  }
  return context;
};
