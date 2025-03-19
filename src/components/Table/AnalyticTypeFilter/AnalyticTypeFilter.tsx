import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { analyticTypes } from './data';
import { AnalyticType, AnalyticSubtype, Selection } from './types';

interface AnalyticTypeFilterProps {
  onChange: (selection: Selection) => void;
  selection?: Selection;
}

export const AnalyticTypeFilter: React.FC<AnalyticTypeFilterProps> = ({ onChange, selection: externalSelection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize with "All" selected
  const initialTypes = analyticTypes.map(t => t.value);
  const initialSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
  const [selection, setSelection] = useState<Selection>({ 
    types: initialTypes,
    subtypes: initialSubtypes
  });

  // Check if filter is active (has non-default selection)
  const allTypes = analyticTypes.map(t => t.value);
  const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
  const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                       allSubtypes.every(st => selection.subtypes.includes(st));
  const isFilterActive = !isAllSelected || (selection.types.length === 0 && selection.subtypes.length === 0);

  // Update internal state when external selection changes
  useEffect(() => {
    if (externalSelection) {
      setSelection(externalSelection);
    }
  }, [externalSelection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    // When selecting All, clear all other selections
    const newSelection = { 
      types: initialTypes, 
      subtypes: initialSubtypes 
    };
    setSelection(newSelection);
    onChange(newSelection);
  };

  const handleSelectNone = () => {
    // When selecting None, clear all other selections
    const newSelection = { types: [], subtypes: [] };
    setSelection(newSelection);
    onChange(newSelection);
  };

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
    } else {
      // Toggle the selection
      if (selection.types.includes(type.value)) {
        // Remove this type and its subtypes
        newSelection = {
          types: selection.types.filter(t => t !== type.value),
          subtypes: selection.subtypes.filter(st => !allSubtypeValues.includes(st))
        };
      } else {
        // Add this type and its subtypes
        newSelection = {
          types: [...selection.types, type.value],
          subtypes: [...selection.subtypes, ...allSubtypeValues]
        };

        // Check if all individual options are now selected
        const allTypesSelected = allTypes.every(t => 
          newSelection.types.includes(t)
        );
        const allSubtypesSelected = allSubtypes.every(st => 
          newSelection.subtypes.includes(st)
        );

        // If all options are selected, switch to "All"
        if (allTypesSelected && allSubtypesSelected) {
          return handleSelectAll();
        }
      }

      // If nothing is selected, switch to All instead of None
      if (newSelection.types.length === 0 && newSelection.subtypes.length === 0) {
        return handleSelectAll();
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
      // Toggle the selection
      if (selection.subtypes.includes(subtype.value)) {
        // Remove this subtype and its parent type if it was selected
        newSelection = {
          types: selection.types.filter(t => t !== subtype.parentType),
          subtypes: selection.subtypes.filter(st => st !== subtype.value)
        };
      } else {
        // Add this subtype
        newSelection = {
          types: selection.types,
          subtypes: [...selection.subtypes, subtype.value]
        };

        // Check if all subtypes of the parent type are now selected
        const parentType = analyticTypes.find(t => t.value === subtype.parentType);
        if (parentType) {
          const allSubtypesOfParent = parentType.subtypes?.map(st => st.value) || [];
          const allSubtypesSelected = allSubtypesOfParent.every(st => 
            newSelection.subtypes.includes(st)
          );

          // If all subtypes are selected, add the parent type to the selection
          if (allSubtypesSelected && !newSelection.types.includes(subtype.parentType)) {
            newSelection = {
              types: [...newSelection.types, subtype.parentType],
              subtypes: newSelection.subtypes
            };
          }
        }

        // Check if all individual options are now selected
        const allTypesSelected = allTypes.every(t => 
          newSelection.types.includes(t)
        );
        const allSubtypesSelected = allSubtypes.every(st => 
          newSelection.subtypes.includes(st)
        );

        // If all options are selected, switch to "All"
        if (allTypesSelected && allSubtypesSelected) {
          return handleSelectAll();
        }
      }

      // If nothing is selected, switch to All instead of None
      if (newSelection.types.length === 0 && newSelection.subtypes.length === 0) {
        return handleSelectAll();
      }
    }
    
    setSelection(newSelection);
    onChange(newSelection);
  };

  // Update chip removal to match the new pattern
  const handleChipRemove = (chip: { value: string; isType: boolean }) => {
    if (chip.isType) {
      const type = analyticTypes.find(t => t.value === chip.value);
      if (type) {
        handleTypeSelect(type);
      }
    } else {
      const subtype = analyticTypes
        .flatMap(t => t.subtypes || [])
        .find(s => s.value === chip.value);
      if (subtype) {
        handleSubtypeSelect(subtype);
      }
    }
  };

  // Update getSelectedChips to show type chips when all subtypes are selected
  const getSelectedChips = () => {
    const chips: { label: string; value: string; count?: number; isType: boolean }[] = [];
    
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    const isAllSelected = allTypes.every(t => selection.types.includes(t)) && 
                         allSubtypes.every(st => selection.subtypes.includes(st));
    
    if (isAllSelected || (selection.types.length === 0 && selection.subtypes.length === 0)) {
      return [];
    }
    
    // Add chips for fully selected types
    selection.types.forEach(typeValue => {
      const type = analyticTypes.find(t => t.value === typeValue);
      if (type) {
        chips.push({ 
          label: type.label, 
          value: type.value, 
          count: type.subtypes?.length || 0,
          isType: true
        });
      }
    });
    
    // Add chips for individual subtypes only if their parent type is not selected
    selection.subtypes.forEach(st => {
      const subtype = analyticTypes
        .flatMap(t => t.subtypes || [])
        .find(s => s.value === st);
      
      if (subtype && !selection.types.includes(subtype.parentType)) {
        // Check if all subtypes of the parent type are selected
        const parentType = analyticTypes.find(t => t.value === subtype.parentType);
        if (parentType) {
          const allSubtypesOfParent = parentType.subtypes?.map(s => s.value) || [];
          const allSubtypesSelected = allSubtypesOfParent.every(s => 
            selection.subtypes.includes(s)
          );

          // If all subtypes are selected, add the parent type chip instead
          if (allSubtypesSelected && !chips.some(c => c.value === subtype.parentType)) {
            chips.push({ 
              label: parentType.label, 
              value: parentType.value, 
              count: allSubtypesOfParent.length,
              isType: true
            });
            return; // Skip adding the individual subtype chip
          }
        }

        chips.push({ 
          label: subtype.label, 
          value: subtype.value,
          isType: false
        });
      }
    });
    
    return chips;
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
        <span>Analytic type: {getDisplayText()}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg" style={{ width: '400px', right: '0' }}>
          <div className="p-2 ">
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
            {getSelectedChips().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {getSelectedChips().map(chip => (
                  <span
                    key={chip.value}
                    className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                  >
                    {chip.label} {chip.count ? `(${chip.count})` : ''}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChipRemove(chip);
                      }}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div 
            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={handleSelectAll}
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 mr-2"
              checked={isAllSelected}
              readOnly
            />
            <span className="text-sm text-gray-700">All</span>
          </div>
          <div 
            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
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

          <div className="max-h-[300px] overflow-y-auto">
            {filteredTypes.map((type) => (
              <div key={type.value}>
                <div 
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTypeSelect(type)}
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 mr-2"
                    checked={!isAllSelected && selection.types.includes(type.value)}
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
                      checked={!isAllSelected && selection.subtypes.includes(subtype.value)}
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