import { analyticTypes } from '../AnalyticTypeFilter/data';
import { engineers } from './engineers';
import { wellLocations } from './wellLocations';
import { additionalRequests } from './additionalRequests';
import { shuffleArray } from './utils';

const generateAnalyticData = () => {
  const sources = ['DataBricks', 'Cygnet', 'PI-AF Analytics'];
  return analyticTypes.flatMap((type, typeIndex) => 
    type.subtypes?.map((subtype, subtypeIndex) => {
      const engineerIndex = (typeIndex + subtypeIndex) % engineers.length;
      const locationIndex = (typeIndex + subtypeIndex) % wellLocations.length;
      const sourceIndex = (typeIndex + subtypeIndex) % sources.length;
      let description = `Detailed analysis comparing ${subtype.label.toLowerCase()} metrics`;
      
      // Add source-specific context to description
      if (sources[sourceIndex] === 'Cygnet') {
        description += ' using real-time historian data';
      } else if (sources[sourceIndex] === 'PI-AF Analytics') {
        description += ' through asset framework analytics';
      } else {
        description += ' via data lake processing';
      }
      
      return {
        location: wellLocations[locationIndex],
        type: type.label,
        subType: subtype.label,
        description: description + '.',
        source: sources[sourceIndex],
        role: 'Production Engineer',
        assignedTo: engineers[engineerIndex],
        arrivalDate: '03/15/24',
        endDate: '03/22/24',
      };
    }) || []
  );
};

export const generateAllData = () => {
  const analyticData = generateAnalyticData();
  return shuffleArray([...analyticData, ...additionalRequests]);
};