import React from 'react';
import { Search } from 'lucide-react';

const BlankState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 mb-4 text-gray-400">
        <Search className="w-full h-full" strokeWidth={2} />
      </div>
      <h3 className="text-md font-medium text-gray-900">No results found</h3>
      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters to find matching results.</p>
    </div>
  );
};

export default BlankState; 