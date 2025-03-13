import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { analyticTypes } from './data';
import { AnalyticType, AnalyticSubtype, Selection } from './types';

interface AnalyticTypeFilterProps {
  onChange: (selection: Selection) => void;
  selection?: Selection;
}

const AnalyticTypeFilter: React.FC<AnalyticTypeFilterProps> = ({ onChange, selection: externalSelection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize with "All" selected
  const initialTypes = analyticTypes.map(t => t.value);
  const initialSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
  const [selection, setSelection] = useState<Selection>({ 
    types: initialTypes,
    subtypes: initialSubtypes
  });

  // Update internal state when external selection changes
  useEffect(() => {
    if (externalSelection) {
      setSelection(externalSelection);
    }
  }, [externalSelection]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeSelect = (type: AnalyticType) => {
    const allSubtypeValues = type.subtypes?.map(st => st.value) || [];
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                         allSubtypes.every(st => selection.subtypes.includes(st));
    
    let newSelection: Selection;
    
    if (isAllSelected) {
      // If all was selected, switch to just this type and its subtypes
      newSelection = {
        types: [type.value],
        subtypes: allSubtypeValues
      };
    } else if (selection.types.includes(type.value)) {
      // Remove this type and its subtypes
      newSelection = {
        types: selection.types.filter(t => t !== type.value),
        subtypes: selection.subtypes.filter(st => !allSubtypeValues.includes(st))
      };
      // If nothing is selected after removal, switch to All
      if (newSelection.types.length === 0 && newSelection.subtypes.length === 0) {
        newSelection = { types: initialTypes, subtypes: initialSubtypes };
      }
    } else {
      // Add this type and its subtypes
      newSelection = {
        types: [...selection.types, type.value],
        subtypes: [...selection.subtypes, ...allSubtypeValues]
      };
      // If all types are now selected, switch to all
      if (newSelection.types.length === allTypes.length && 
          allSubtypes.every(st => newSelection.subtypes.includes(st))) {
        newSelection = { types: allTypes, subtypes: allSubtypes };
      }
    }
    
    setSelection(newSelection);
    onChange(newSelection);
  };

  const handleSubtypeSelect = (subtype: AnalyticSubtype) => {
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                         allSubtypes.every(st => selection.subtypes.includes(st));

    let newSelection: Selection;

    if (isAllSelected) {
      // If all was selected, switch to just this subtype
      newSelection = {
        types: [],
        subtypes: [subtype.value]
      };
    } else {
      const parentType = analyticTypes.find(t => t.value === subtype.parentType);
      const allSubtypesOfType = parentType?.subtypes?.map(st => st.value) || [];
      
      if (selection.subtypes.includes(subtype.value)) {
        // Remove this subtype
        const newSubtypes = selection.subtypes.filter(st => st !== subtype.value);
        newSelection = {
          types: selection.types.filter(t => t !== subtype.parentType),
          subtypes: newSubtypes
        };
        // If nothing is selected after removal, switch to All
        if (newSelection.types.length === 0 && newSelection.subtypes.length === 0) {
          newSelection = { types: initialTypes, subtypes: initialSubtypes };
        }
      } else {
        // Add this subtype
        const newSubtypes = [...selection.subtypes, subtype.value];
        
        // Only add the parent type if ALL subtypes are selected
        if (allSubtypesOfType.every(st => newSubtypes.includes(st))) {
          newSelection = {
            types: [...selection.types, subtype.parentType],
            subtypes: newSubtypes
          };
          // If all types are now selected, switch to all
          if (newSelection.types.length === allTypes.length && 
              allSubtypes.every(st => newSelection.subtypes.includes(st))) {
            newSelection = { types: allTypes, subtypes: allSubtypes };
          }
        } else {
          newSelection = {
            types: selection.types.filter(t => t !== subtype.parentType),
            subtypes: newSubtypes
          };
        }
      }
    }
    
    setSelection(newSelection);
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    const newSelection = { 
      types: initialTypes, 
      subtypes: initialSubtypes 
    };
    setSelection(newSelection);
    onChange(newSelection);
  };

  const handleSelectNone = () => {
    const newSelection = { types: [], subtypes: [] };
    setSelection(newSelection);
    onChange(newSelection);
  };

  const getDisplayText = () => {
    if (selection.types.length === 0 && selection.subtypes.length === 0) {
      return 'None';
    }
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                         allSubtypes.every(st => selection.subtypes.includes(st));
    
    if (isAllSelected) {
      return 'All';
    }
    const totalSelected = selection.types.reduce((count, type) => {
      const typeSubtypes = analyticTypes.find(t => t.value === type)?.subtypes?.length || 0;
      return count + typeSubtypes;
    }, 0);
    const individualSubtypes = selection.subtypes.filter(st => 
      !selection.types.includes(analyticTypes.flatMap(t => t.subtypes || []).find(s => s.value === st)?.parentType || '')
    ).length;
    return `(${totalSelected + individualSubtypes})`;
  };

  const getSelectedChips = () => {
    const chips: { label: string; value: string; count?: number }[] = [];
    
    // Add "All" chip if everything is selected
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                         allSubtypes.every(st => selection.subtypes.includes(st));
    
    if (isAllSelected) {
      return [];
    }

    // If nothing is selected, return empty array (no chip)
    if (selection.types.length === 0 && selection.subtypes.length === 0) {
      return [];
    }
    
    // Add chips for fully selected types
    selection.types.forEach(typeValue => {
      const type = analyticTypes.find(t => t.value === typeValue);
      if (type) {
        chips.push({ 
          label: type.label, 
          value: type.value, 
          count: type.subtypes?.length || 0 
        });
      }
    });
    
    // Add chips for individual subtypes (that aren't part of a fully selected type)
    selection.subtypes.forEach(st => {
      const subtype = analyticTypes
        .flatMap(t => t.subtypes || [])
        .find(s => s.value === st);
      
      if (subtype && !selection.types.includes(subtype.parentType)) {
        chips.push({ label: subtype.label, value: subtype.value });
      }
    });
    
    return chips;
  };

  const getFilteredTypes = () => {
    return analyticTypes.filter(type => {
      const matchingSubtypes = type.subtypes?.filter(subtype =>
        subtype.label.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

      const typeMatches = type.label.toLowerCase().includes(searchTerm.toLowerCase());

      if (typeMatches || matchingSubtypes.length > 0) {
        return {
          ...type,
          subtypes: typeMatches ? type.subtypes : matchingSubtypes
        };
      }
      return false;
    });
  };

  const filteredTypes = getFilteredTypes();
  
  // Check if all types and subtypes are selected
  const allTypes = analyticTypes.map(t => t.value);
  const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
  const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                       allSubtypes.every(st => selection.subtypes.includes(st));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 whitespace-nowrap ${
          !isAllSelected || (selection.types.length === 0 && selection.subtypes.length === 0) ? 'bg-sky-50 text-sky-700' : 'bg-white text-gray-600'
        }`}
      >
        <span>Analytic type: {getDisplayText()}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg" style={{ width: '400px', right: '0' }}>
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Search types and subtypes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {getSelectedChips().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {getSelectedChips().map(chip => (
                  <span
                    key={chip.value}
                    className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                  >
                    {chip.label} {chip.count ? `(${chip.count})` : ''}
                    {chip.value !== 'all' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (chip.value === 'none') {
                            // Do nothing when clicking X on none
                          } else if (selection.types.includes(chip.value)) {
                            const type = analyticTypes.find(t => t.value === chip.value);
                            if (type) {
                              const subtypesToRemove = type.subtypes?.map(st => st.value) || [];
                              const newSelection = {
                                types: selection.types.filter(t => t !== chip.value),
                                subtypes: selection.subtypes.filter(st => !subtypesToRemove.includes(st))
                              };
                              if (newSelection.types.length === 0 && newSelection.subtypes.length === 0) {
                                handleSelectAll();
                              } else {
                                setSelection(newSelection);
                                onChange(newSelection);
                              }
                            }
                          } else {
                            const newSelection = {
                              types: selection.types,
                              subtypes: selection.subtypes.filter(st => st !== chip.value)
                            };
                            if (newSelection.types.length === 0 && newSelection.subtypes.length === 0) {
                              handleSelectAll();
                            } else {
                              setSelection(newSelection);
                              onChange(newSelection);
                            }
                          }
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <div 
              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={handleSelectAll}
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 mr-2"
                checked={selection.types.length === analyticTypes.length}
                readOnly
              />
              <span className="text-sm text-gray-700">All</span>
            </div>
            <div 
              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={handleSelectNone}
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 mr-2"
                checked={selection.types.length === 0 && selection.subtypes.length === 0}
                readOnly
              />
              <span className="text-sm text-gray-700">None</span>
            </div>
            {filteredTypes.map((type) => (
              <div key={type.value}>
                <div 
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTypeSelect(type)}
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 mr-2"
                    checked={selection.types.includes(type.value)}
                    readOnly
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </div>
                {type.subtypes?.map((subtype) => (
                  <div
                    key={subtype.value}
                    className="flex items-center pl-8 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSubtypeSelect(subtype)}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 mr-2"
                      checked={selection.subtypes.includes(subtype.value)}
                      readOnly
                    />
                    <span className="text-sm text-gray-700">{subtype.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticTypeFilter;