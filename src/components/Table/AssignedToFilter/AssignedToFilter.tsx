import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { engineers } from '../mockData/engineers';

interface AssignedToFilterProps {
  onChange: (selection: string[]) => void;
  selection?: string[];
}

const AssignedToFilter: React.FC<AssignedToFilterProps> = ({ onChange, selection: externalSelection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>(['all']);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Transform display name to filter value
  const toFilterValue = (name: string): string => {
    if (name === 'all') return 'all';
    if (name === 'Unassigned') return 'unassigned';
    return name.toLowerCase().replace(/\s+/g, '');
  };

  // Transform filter value back to display name
  const toDisplayValue = (filterValue: string): string => {
    if (filterValue === 'all') return 'all';
    if (filterValue === 'unassigned') return 'Unassigned';
    return engineers.find(eng => toFilterValue(eng) === filterValue) || filterValue;
  };

  // Handle external selection changes (e.g., from Clear Filters)
  useEffect(() => {
    if (externalSelection) {
      // Convert filter values back to display values
      const displayValues = externalSelection.includes('all')
        ? ['all']
        : externalSelection.map(toDisplayValue);
      setSelectedEngineers(displayValues);
    }
  }, [externalSelection]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (engineer: string) => {
    let newSelection: string[];

    if (engineer === 'all') {
      // When selecting All, clear all other selections
      newSelection = ['all'];
    } else {
      if (selectedEngineers.includes('all')) {
        // If All was selected, switch to just this engineer
        newSelection = [engineer];
      } else {
        // Toggle the selection
        newSelection = selectedEngineers.includes(engineer)
          ? selectedEngineers.filter(e => e !== engineer)
          : [...selectedEngineers, engineer];
        
        // If no engineers are selected, switch to "All"
        if (newSelection.length === 0) {
          newSelection = ['all'];
        }
      }
    }

    // Update internal state with display values
    setSelectedEngineers(newSelection);
    
    // Notify parent with filter values
    const filterValues = newSelection.includes('all')
      ? ['all']
      : newSelection.map(toFilterValue);
    onChange(filterValues);
  };

  const handleChipRemove = (engineer: string) => {
    handleSelect(engineer); // Reuse the same selection logic
  };

  // Filter engineers based on search term
  const filteredEngineers = ['all', ...engineers].filter(engineer =>
    engineer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFilterActive = !selectedEngineers.includes('all');

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
        <span>
          {isFilterActive 
            ? `Assigned to: (${selectedEngineers.length})`
            : 'Assigned to: All'
          }
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
          style={{ width: '410px', right: '0' }}
        >
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mt-2 border border-gray-200 rounded-md">
              <div className="h-[90px] overflow-y-auto p-2">
                <div className="flex flex-wrap gap-1">
                  {selectedEngineers.includes('all') ? (
                    <span className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500">
                      All items selected
                    </span>
                  ) : (
                    selectedEngineers.map(engineer => (
                      <span
                        key={engineer}
                        className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs"
                      >
                        <span className="text-xs">{engineer}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChipRemove(engineer);
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <label
            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 mr-2"
              checked={selectedEngineers.includes('all')}
              onChange={() => handleSelect('all')}
            />
            <span className="text-sm text-gray-700">All</span>
          </label>

          <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
            <div className="py-1">
              {filteredEngineers
                .filter(engineer => engineer !== 'all')
                .map((engineer) => (
                <label
                  key={engineer}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 mr-2"
                    checked={selectedEngineers.includes(engineer)}
                    onChange={() => handleSelect(engineer)}
                  />
                  <span className="text-sm text-gray-700">{engineer}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedToFilter; 
 