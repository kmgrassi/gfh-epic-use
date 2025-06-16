import { useState } from "react";

interface MetricParam {
  title: string;
  metricId: number;
}

const aggregateParams = [
  "(IP) Time in In Basket per Patient per Day",
  "(IP) Time in Documentation per Patient per Day",
];

export const possibleParams: MetricParam[] = [
  { title: "(IP) Time in Documentation per Patient per Day", metricId: 2281 },
  { title: "(IP) Time in Orders per Patient per Day", metricId: 2224 },
  {
    title: "(IP) Time in In Basket per Patient per Day - Chart Completion",
    metricId: 2237,
  },
  {
    title: "(IP) Time in Clinical Review per Patient per Day - Patient Reports",
    metricId: 2230,
  },
  { title: "(IP) Time in Communications per Patient per Day", metricId: 2282 },
];

interface ParamSelectProps {
  selectedParams: string[];
  onParamsChange: (params: string[]) => void;
}

export function ParamSelect({
  selectedParams,
  onParamsChange,
}: ParamSelectProps) {
  const [availableParams, setAvailableParams] =
    useState<MetricParam[]>(possibleParams);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue && !selectedParams.includes(selectedValue)) {
      const newSelectedParams = [...selectedParams, selectedValue];
      onParamsChange(newSelectedParams);
      setAvailableParams(
        availableParams.filter((param) => param.title !== selectedValue)
      );
    }
  };

  const handleRemove = (paramToRemove: string) => {
    const newSelectedParams = selectedParams.filter(
      (param) => param !== paramToRemove
    );
    onParamsChange(newSelectedParams);
    const removedParam = possibleParams.find((p) => p.title === paramToRemove);
    if (removedParam) {
      setAvailableParams(
        [...availableParams, removedParam].sort((a, b) =>
          a.title.localeCompare(b.title)
        )
      );
    }
  };

  return (
    <div className="param-select">
      <h2>Select Parameters</h2>
      <select
        className="param-select-dropdown"
        onChange={handleSelect}
        value=""
      >
        <option value="">Select a parameter...</option>
        {availableParams.map((param) => (
          <option key={param.metricId} value={param.title}>
            {param.title} (ID: {param.metricId})
          </option>
        ))}
      </select>

      {selectedParams.length > 0 && (
        <div className="selected-params">
          <h3>Selected Parameters:</h3>
          <ul>
            {selectedParams.map((param) => {
              const metricParam = possibleParams.find((p) => p.title === param);
              return (
                <li key={param} className="selected-param-item">
                  <div className="param-info">
                    <span className="param-title">{param}</span>
                    {metricParam && (
                      <span className="param-id">
                        ID: {metricParam.metricId}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(param)}
                    className="remove-button"
                    aria-label={`Remove ${param}`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
