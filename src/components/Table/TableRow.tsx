import React from 'react';
import { analyticTypes } from './AnalyticTypeFilter/data';
import { isOperationalRequest } from './mockData/requestTypes';

interface TableRowProps {
  location: string;
  type: string;
  subType?: string;
  description: string;
  source: string;
  role: string;
  assignedTo?: string;
  arrivalDate: string;
  endDate: string;
}

const TableRow: React.FC<TableRowProps> = ({
  location,
  type,
  subType,
  description,
  source,
  role,
  assignedTo,
  arrivalDate,
  endDate,
}) => {
  // Check if this is an analytics row by seeing if the type matches any analytic type
  const isAnalytics = analyticTypes.some(
    analyticType => analyticType.label === type || 
    analyticType.subtypes?.some(subtype => subtype.label === type)
  );

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="py-4 pl-4">
        <input type="checkbox" className="rounded border-gray-300" />
      </td>
      <td className="py-4 text-sm truncate pr-4">{location}</td>
      <td className="py-4 pr-4">
        <div>
          {subType ? (
            <>
              <div className="text-sm truncate">{subType}</div>
              <div className="text-xs text-gray-500 truncate">{type}</div>
            </>
          ) : (
            <>
              <div className="text-sm truncate">{type}</div>
              {isOperationalRequest(type) && (
                <div className="text-xs text-gray-500 truncate">Request</div>
              )}
            </>
          )}
        </div>
      </td>
      <td className="py-4 pr-4">
        <p className="text-gray-800 truncate text-sm">{description}</p>
      </td>
      <td className="py-4 text-sm truncate pr-4">{source}</td>
      <td className="py-4 text-sm truncate pr-4">{role}</td>
      <td className="py-4 text-sm truncate pr-4">{assignedTo || 'Unassigned'}</td>
      <td className="py-4 text-sm truncate pr-4">{arrivalDate}</td>
      <td className="py-4 text-sm truncate pr-4">{endDate}</td>
    </tr>
  );
};

export default TableRow