import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import AnalyticTypeFilter from './AnalyticTypeFilter/AnalyticTypeFilter';
import AssignedToFilter from './AssignedToFilter/AssignedToFilter';
import { Selection } from './AnalyticTypeFilter/types';
import { analyticTypes } from './AnalyticTypeFilter/data';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterProps {
  label: string;
  options: FilterOption[];
  selectedOptions: string[];
  onChange: (value: string[]) => void;
  isRequestTypeFilter?: boolean;
}

export const Filter: React.FC<FilterProps> = ({ 
  label, 
  options, 
  selectedOptions, 
  onChange,
  isRequestTypeFilter = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if filter is active (has non-default selection)
  const isFilterActive = !selectedOptions.includes('all') || selectedOptions.length > 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionToggle = (value: string) => {
    if (isRequestTypeFilter) {
      // Handle request type filter special cases
      if (value === 'none') {
        // When selecting None, clear other selections
        onChange(['none']);
      } else if (value === 'all') {
        // Don't allow deselecting 'all' directly
        if (!selectedOptions.includes('all')) {
          onChange(['all']);
        }
      } else {
        // When selecting a specific option
        let newSelected: string[];
        
        if (selectedOptions.includes('all')) {
          // If All was selected, switch to just this option
          newSelected = [value];
        } else if (selectedOptions.includes('none')) {
          // If None was selected, switch to just this option
          newSelected = [value];
        } else {
          // Toggle the selection
          newSelected = selectedOptions.includes(value)
            ? selectedOptions.filter(v => v !== value)
            : [...selectedOptions, value];
        }
        
        // Get all options except 'all' and 'none'
        const individualOptions = options
          .filter(opt => opt.value !== 'all' && opt.value !== 'none')
          .map(opt => opt.value);
        
        // Check if all individual options are selected
        const allIndividualSelected = individualOptions.every(opt => 
          newSelected.includes(opt)
        );

        // If all individual options are selected, switch to 'all'
        if (allIndividualSelected) {
          onChange(['all']);
        } else if (newSelected.length === 0) {
          // If no options are selected, switch to 'none'
          onChange(['none']);
        } else {
          onChange(newSelected);
        }
      }
    } else {
      // Handle other filters
      if (value === 'all') {
        // Don't allow deselecting 'all' directly
        if (!selectedOptions.includes('all')) {
          onChange(['all']);
        }
      } else {
        let newSelected: string[];
        
        if (selectedOptions.includes('all')) {
          // If All was selected, switch to just this option
          newSelected = [value];
        } else {
          // Toggle the selection
          newSelected = selectedOptions.includes(value)
            ? selectedOptions.filter(v => v !== value)
            : [...selectedOptions.filter(v => v !== 'all'), value];
        }

        // Get all options except 'all'
        const individualOptions = options
          .filter(opt => opt.value !== 'all')
          .map(opt => opt.value);
        
        // Check if all individual options are selected
        const allIndividualSelected = individualOptions.every(opt => 
          newSelected.includes(opt)
        );

        // If all individual options are selected or no options are selected, switch to 'all'
        if (allIndividualSelected || newSelected.length === 0) {
          onChange(['all']);
        } else {
          onChange(newSelected);
        }
      }
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.includes('all')) {
      return `${label}: All`;
    }
    if (selectedOptions.includes('none')) {
      return `${label}: None`;
    }
    return `${label}: (${selectedOptions.length})`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between border rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 whitespace-nowrap ${
          !selectedOptions.includes('all') || selectedOptions.includes('none') ? 'bg-sky-50 text-sky-700' : 'bg-white text-gray-600'
        } ${isOpen ? 'border-gray-400' : 'border-gray-300'}`}
      >
        <span>{getDisplayText()}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg" style={{ width: '260px', right: '0' }}>
          <div className="py-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 mr-2"
                  checked={option.value === 'none' ? selectedOptions.includes('none') : (selectedOptions.includes('all') || selectedOptions.includes(option.value))}
                  onChange={() => handleOptionToggle(option.value)}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
        options={[
          { label: 'All', value: 'all' },
          { label: 'None', value: 'none' },
          { label: 'Ad Hoc', value: 'adhoc' },
          { label: 'Down Well', value: 'downwell' },
          { label: 'AL Review', value: 'alreview' },
          { label: 'Margin', value: 'margin' },
          { label: 'Allocation', value: 'allocation' },
          { label: 'Production Fault', value: 'productionfault' }
        ]}
        selectedOptions={requestTypeSelected || ['all']}
        onChange={onRequestTypeChange || (() => {})}
        isRequestTypeFilter={true}
      />
      <AnalyticTypeFilter
        onChange={onAnalyticTypeChange || (() => {})}
        selection={analyticSelection}
      />
      <Filter
        label="Source"
        options={[
          { label: 'All', value: 'all' },
          { label: 'WorkQueue', value: 'workqueue' },
          { label: 'DataBricks', value: 'databricks' },
          { label: 'Cygnet', value: 'cygnet' },
          { label: 'PI-AF Analytics', value: 'piafanalytics' }
        ]}
        selectedOptions={sourceSelected || ['all']}
        onChange={onSourceChange || (() => {})}
      />
      <Filter
        label="Role"
        options={[
          { label: 'All', value: 'all' },
          { label: 'Production Engineer', value: 'productionengineer' },
          { label: 'Production Foreman', value: 'productionforeman' },
          { label: 'Production Assistant Foreman', value: 'productionassistantforeman' },
          { label: 'DSC Production Analyst', value: 'dscproductionanalyst' }
        ]}
        selectedOptions={roleSelected || ['all']}
        onChange={onRoleChange || (() => {})}
      />
      <AssignedToFilter
        onChange={onAssignedToChange || (() => {})}
        selection={assignedToSelected}
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