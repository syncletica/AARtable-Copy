import React, { useState, useMemo } from 'react';
import TableRow from './TableRow';
import Filters from './Filters';
import { generateAllData } from './mockData/generateMockData';
import { Selection } from './AnalyticTypeFilter/types';
import { analyticTypes } from './AnalyticTypeFilter/data';
import { isOperationalRequest } from './mockData/requestTypes';

// Get the data from our mock data generator
const allData = generateAllData();

interface TableRowData {
  location: string;
  type: string;
  subType?: string;
  description: string;
  source: string;
  role: string;
  assignedTo: string;
  arrivalDate: string;
  endDate: string;
}

// Initialize with all types and subtypes
const initialAnalyticSelection: Selection = {
  types: analyticTypes.map(t => t.value),
  subtypes: analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || [])
};

const Table: React.FC = () => {
  const [analyticSelection, setAnalyticSelection] = useState<Selection>(initialAnalyticSelection);
  const [requestTypeSelected, setRequestTypeSelected] = useState<string[]>(['all']);
  const [sourceSelected, setSourceSelected] = useState<string[]>(['all']);
  const [roleSelected, setRoleSelected] = useState<string[]>(['all']);
  const [assignedToSelected, setAssignedToSelected] = useState<string[]>(['all']);

  const filteredData = useMemo(() => {
    return (allData as TableRowData[]).filter(row => {
      const isRequest = isOperationalRequest(row.type);

      // Handle request type rows
      if (isRequest) {
        // If "none" is selected for requests, hide all request rows
        if (requestTypeSelected.includes('none')) {
          return false;
        }
        // If not "all" and not in selected request types, hide the row
        if (!requestTypeSelected.includes('all') && 
            !requestTypeSelected.includes(row.type.toLowerCase().replace(/\s+/g, ''))) {
          return false;
        }
      } else {
        // Handle analytic rows
        const matchingAnalyticType = analyticTypes.find(t => t.label === row.type);
        if (matchingAnalyticType) {
          // If no filters are selected, hide all analytics (none state)
          if (analyticSelection.types.length === 0 && analyticSelection.subtypes.length === 0) {
            return false;
          }
          // If parent type is selected, show the row
          else if (analyticSelection.types.includes(matchingAnalyticType.value)) {
            // continue to other filters
          }
          // If subtype matches, show the row
          else if (row.subType) {
            const matchingSubtype = matchingAnalyticType.subtypes?.find(st => st.label === row.subType);
            if (!matchingSubtype || !analyticSelection.subtypes.includes(matchingSubtype.value)) {
              return false;
            }
          } else {
            return false;
          }
        }
      }

      // Apply source filter
      if (!sourceSelected.includes('all') && 
          !sourceSelected.includes(row.source.toLowerCase().replace(/\s+/g, ''))) {
        return false;
      }

      // Apply role filter
      if (!roleSelected.includes('all') && 
          !roleSelected.includes(row.role.toLowerCase().replace(/\s+/g, ''))) {
        return false;
      }

      // Apply assigned to filter
      if (!assignedToSelected.includes('all') && 
          !assignedToSelected.includes(row.assignedTo?.toLowerCase().replace(/\s+/g, '') || '')) {
        return false;
      }

      return true;
    });
  }, [requestTypeSelected, analyticSelection, sourceSelected, roleSelected, assignedToSelected]);

  const handleClearFilters = () => {
    const allTypes = analyticTypes.map(t => t.value);
    const allSubtypes = analyticTypes.flatMap(t => t.subtypes?.map(st => st.value) || []);
    setAnalyticSelection({ types: allTypes, subtypes: allSubtypes });
    setRequestTypeSelected(['all']);
    setSourceSelected(['all']);
    setRoleSelected(['all']);
    setAssignedToSelected(['all']);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-50 rounded-t-lg">
        <div className="flex flex-wrap items-start gap-4">
          <h1 className="text-md font-semibold text-gray-800 shrink-0">Available Analytics and Requests</h1>
          <div className="ml-auto">
            <Filters 
              onClearFilters={handleClearFilters}
              onAnalyticTypeChange={setAnalyticSelection}
              analyticSelection={analyticSelection}
              requestTypeSelected={requestTypeSelected}
              onRequestTypeChange={setRequestTypeSelected}
              sourceSelected={sourceSelected}
              onSourceChange={setSourceSelected}
              roleSelected={roleSelected}
              onRoleChange={setRoleSelected}
              assignedToSelected={assignedToSelected}
              onAssignedToChange={setAssignedToSelected}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-white z-40">
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="py-4 pl-4 w-10 bg-white"></th>
              <th className="py-4 w-[280px] bg-white">Location</th>
              <th className="py-4 w-[280px] bg-white">Type</th>
              <th className="py-4 min-w-xs bg-white">Description</th>
              <th className="py-4 w-[130px] bg-white">Source</th>
              <th className="py-4 w-[180px] bg-white">Role</th>
              <th className="py-4 w-[180px] bg-white">Assigned to</th>
              <th className="py-4 w-[110px] bg-white">Arrival date</th>
              <th className="py-4 w-[110px] bg-white">End date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <TableRow key={index} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;