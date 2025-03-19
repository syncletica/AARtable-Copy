import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
        // When selecting All, clear all other selections
        onChange(['all']);
      } else {
        // When selecting a specific option
        let newSelected: string[];
        
        if (selectedOptions.includes('all') || selectedOptions.includes('none')) {
          // If All or None was selected, switch to just this option
          newSelected = [value];
        } else {
          // Toggle the selection
          newSelected = selectedOptions.includes(value)
            ? selectedOptions.filter(v => v !== value)
            : [...selectedOptions, value];
        }
        
        // If no options are selected, switch to 'all' instead of 'none'
        if (newSelected.length === 0) {
          onChange(['all']);
        } else {
          // Check if all non-all/non-none options are selected
          const allIndividualOptions = options
            .filter(opt => opt.value !== 'all' && opt.value !== 'none')
            .map(opt => opt.value);
          
          const allIndividualSelected = allIndividualOptions.every(opt => 
            newSelected.includes(opt)
          );

          // If all individual options are selected, switch to 'all'
          if (allIndividualSelected) {
            onChange(['all']);
          } else {
            onChange(newSelected);
          }
        }
      }
    } else {
      // Handle other filters
      if (value === 'all') {
        // When selecting All, clear all other selections
        onChange(['all']);
      } else {
        let newSelected: string[];
        
        if (selectedOptions.includes('all')) {
          // If All was selected, switch to just this option
          newSelected = [value];
        } else {
          // Toggle the selection
          newSelected = selectedOptions.includes(value)
            ? selectedOptions.filter(v => v !== value)
            : [...selectedOptions, value];
        }

        // If no options are selected, switch to 'all'
        if (newSelected.length === 0) {
          onChange(['all']);
        } else {
          // Check if all non-all options are selected
          const allIndividualOptions = options
            .filter(opt => opt.value !== 'all')
            .map(opt => opt.value);
          
          const allIndividualSelected = allIndividualOptions.every(opt => 
            newSelected.includes(opt)
          );

          // If all individual options are selected, switch to 'all'
          if (allIndividualSelected) {
            onChange(['all']);
          } else {
            onChange(newSelected);
          }
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
        className={`
          flex items-center justify-between
          rounded-md py-1 px-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-sky-400
          whitespace-nowrap
          transition-colors duration-150
          ${isFilterActive 
            ? 'bg-sky-50 text-sky-700 border border-sky-200 hover:border-sky-500' 
            : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-500'
          }
          ${isOpen ? 'border-sky-600' : ''}
        `}
      >
        <span>{getDisplayText()}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg" style={{ width: '260px', right: '0' }}>
          <div className="py-1">
            {options.map((option, index) => (
              <label
                key={option.value}
                className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap ${
                  (isRequestTypeFilter && option.value === 'none') || (!isRequestTypeFilter && option.value === 'all') ? 'border-b border-gray-200' : ''
                }`}
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 mr-2"
                  checked={
                    option.value === 'all' 
                      ? selectedOptions.includes('all')
                      : option.value === 'none'
                        ? selectedOptions.includes('none')
                        : selectedOptions.includes(option.value)
                  }
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