import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MetricWithStats } from "./types";

interface DepartmentContextType {
  departments: string[];
  selectedDepartments: string[];
  setSelectedDepartments: (departments: string[]) => void;
  filteredMetrics: MetricWithStats[];
  filteredAggregateMetrics: MetricWithStats[];
  isFiltering: boolean;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined
);

export const DepartmentProvider: React.FC<{
  children: React.ReactNode;
  metrics: MetricWithStats[];
  aggregateMetrics: MetricWithStats[];
}> = ({ children, metrics, aggregateMetrics }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Extract unique departments from metrics data
  useEffect(() => {
    const allMetrics = [...metrics, ...aggregateMetrics];
    const departmentSet = new Set<string>();

    allMetrics.forEach((metric) => {
      metric.values.forEach((value) => {
        const department = value.Department || value["Login Department"];
        if (department && department.trim()) {
          departmentSet.add(department.trim());
        }
      });
    });

    const uniqueDepartments = Array.from(departmentSet).sort();

    setDepartments(uniqueDepartments);

    // Auto-select all departments only on initial load (when departments array is empty)
    if (departments.length === 0 && uniqueDepartments.length > 0) {
      setSelectedDepartments(uniqueDepartments);
    }
  }, [metrics, aggregateMetrics, departments.length]);

  // Filter metrics based on selected departments
  const filterMetricsByDepartments = useCallback(
    (metricsToFilter: MetricWithStats[]): MetricWithStats[] => {
      if (
        selectedDepartments.length === 0 ||
        selectedDepartments.length === departments.length
      ) {
        return metricsToFilter;
      }

      const filtered = metricsToFilter
        .map((metric) => {
          const filteredValues = metric.values.filter((value) => {
            const department = value.Department || value["Login Department"];
            const isIncluded =
              department && selectedDepartments.includes(department.trim());

            return isIncluded;
          });

          if (filteredValues.length === 0) {
            console.log(`No values remain for metric: ${metric.metric}`);
            return null;
          }

          // Recalculate statistics for filtered values
          const values = filteredValues.map((v) => v.Value);
          const averageValue =
            values.reduce((sum, val) => sum + val, 0) / values.length;
          const standardDeviation = calculateStandardDeviation(values);
          const medianValue = calculateMedian(values);

          return {
            ...metric,
            count: filteredValues.length,
            averageValue,
            medianValue,
            standardDeviation,
            values: filteredValues,
          };
        })
        .filter((metric): metric is MetricWithStats => metric !== null);

      return filtered;
    },
    [selectedDepartments, departments.length]
  );

  // Calculate standard deviation
  const calculateStandardDeviation = (values: number[]): number => {
    if (values.length <= 1) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance =
      squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1);
    return Math.sqrt(variance);
  };

  // Calculate median
  const calculateMedian = (values: number[]): number => {
    const sorted = values.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };

  // Apply department filtering
  const filteredMetrics = useMemo(() => {
    const result = filterMetricsByDepartments(metrics);

    return result;
  }, [filterMetricsByDepartments, metrics]);

  const filteredAggregateMetrics = useMemo(() => {
    const result = filterMetricsByDepartments(aggregateMetrics);

    return result;
  }, [filterMetricsByDepartments, aggregateMetrics]);

  // Track filtering state
  useEffect(() => {
    if (
      selectedDepartments.length > 0 &&
      selectedDepartments.length < departments.length
    ) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsFiltering(false);
    }
  }, [selectedDepartments, departments.length]);

  const value = {
    departments,
    selectedDepartments,
    setSelectedDepartments,
    filteredMetrics,
    filteredAggregateMetrics,
    isFiltering,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error("useDepartment must be used within a DepartmentProvider");
  }
  return context;
};
