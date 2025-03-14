import { Selection } from '../AnalyticTypeFilter/types';
import { analyticTypes } from '../AnalyticTypeFilter/data';
import { isOperationalRequest } from '../mockData/requestTypes';

export interface TableRowData {
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

export const filterTableData = (
  data: TableRowData[],
  requestTypeSelected: string[],
  analyticSelection: Selection,
  sourceSelected: string[],
  roleSelected: string[],
  assignedToSelected: string[]
): TableRowData[] => {
  return data.filter(row => {
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
    if (!assignedToSelected.includes('all')) {
      const assignedValue = row.assignedTo?.toLowerCase().replace(/\s+/g, '') || 'unassigned';
      if (!assignedToSelected.includes(assignedValue)) {
        return false;
      }
    }

    return true;
  });
}; 