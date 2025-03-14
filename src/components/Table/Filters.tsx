import React from 'react';
import AnalyticTypeFilter from './AnalyticTypeFilter/AnalyticTypeFilter';
import AssignedToFilter from './AssignedToFilter/AssignedToFilter';
import { Filter } from './Filter/Filter';
import { Selection } from './AnalyticTypeFilter/types';
import { analyticTypes } from './AnalyticTypeFilter/data';
import { requestTypeOptions, sourceOptions, roleOptions } from './Filter/filterOptions';

interface FiltersProps {
  onClearFilters: () => void;
  onAnalyticTypeChange?: (selection: Selection) => void;
  analyticSelection?: Selection;
  requestTypeSelected?: string[];
  onRequestTypeChange?: (value: string[]) => void;
  sourceSelected?: string[];
  onSourceChange?: (value: string[]) => void;
  roleSelected?: string[];
  onRoleChange?: (value: string[]) => void;
  assignedToSelected?: string[];
  onAssignedToChange?: (value: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  onClearFilters,
  onAnalyticTypeChange,
  analyticSelection,
  requestTypeSelected,
  onRequestTypeChange,
  sourceSelected,
  onSourceChange,
  roleSelected,
  onRoleChange,
  assignedToSelected,
  onAssignedToChange,
}) => {
  // Check if any filter is active
  const isAnyFilterActive = 
    (requestTypeSelected && (!requestTypeSelected.includes('all') || requestTypeSelected.includes('none'))) ||
    (analyticSelection && (
      // For analytic type, it's active if:
      // 1. It's set to None (no types and no subtypes)
      // 2. OR it has some specific selections (not All)
      (analyticSelection.types.length === 0 && analyticSelection.subtypes.length === 0) || 
      !analyticTypes.every(t => analyticSelection.types.includes(t.value))
    )) ||
    (sourceSelected && !sourceSelected.includes('all')) ||
    (roleSelected && !roleSelected.includes('all')) ||
    (assignedToSelected && !assignedToSelected.includes('all'));

  const handleClearFilters = () => {
    onRequestTypeChange?.(['all']);
    // Set analytic type filter to "All" by including all types and subtypes
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    onAnalyticTypeChange?.({ 
      types: allTypes,
      subtypes: allSubtypes
    });
    onSourceChange?.(['all']);
    onRoleChange?.(['all']);
    onAssignedToChange?.(['all']);
    onClearFilters();
  };

  return (
    <div className="flex items-center gap-4">
      <Filter
        label="Request type"
        options={requestTypeOptions}
        selectedOptions={requestTypeSelected || ['all']}
        onChange={onRequestTypeChange || (() => {})}
        isRequestTypeFilter
      />
      <AnalyticTypeFilter
        selection={analyticSelection}
        onChange={onAnalyticTypeChange || (() => {})}
      />
      <Filter
        label="Source"
        options={sourceOptions}
        selectedOptions={sourceSelected || ['all']}
        onChange={onSourceChange || (() => {})}
      />
      <Filter
        label="Role"
        options={roleOptions}
        selectedOptions={roleSelected || ['all']}
        onChange={onRoleChange || (() => {})}
      />
      <AssignedToFilter
        selection={assignedToSelected}
        onChange={onAssignedToChange || (() => {})}
      />
      <button
        className={`text-sm ${isAnyFilterActive ? 'text-sky-600 hover:text-sky-700' : 'text-gray-400'}`}
        onClick={handleClearFilters}
        disabled={!isAnyFilterActive}
      >
        Clear filters
      </button>
    </div>
  );
};

export default Filters;