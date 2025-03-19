import React, { useState, useMemo } from 'react';
import TableRow from './TableRow';
import Filters from './Filters';
import { generateAllData } from './mockData/generateMockData';
import { Selection } from './AnalyticTypeFilter/types';
import { analyticTypes } from './AnalyticTypeFilter/data';
import { filterTableData, TableRowData } from './utils/filterData';

// Get the data from our mock data generator
const allData = generateAllData();

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
    return filterTableData(
      allData as TableRowData[],
      requestTypeSelected,
      analyticSelection,
      sourceSelected,
      roleSelected,
      assignedToSelected
    );
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
              <th className="py-4 w-[250px] bg-white">Location</th>
              <th className="py-4 w-[250px] bg-white">Type</th>
              <th className="py-4 bg-white">Description</th>
              <th className="py-4 w-[130px] bg-white">Source</th>
              <th className="py-4 w-[210px] bg-white">Assigned to & Role</th>
              <th className="py-4 w-[100px] bg-white">Arrival date</th>
              <th className="py-4 w-[100px] bg-white">End date</th>
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