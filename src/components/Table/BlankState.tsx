import React from 'react';

const BlankState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 mb-4 text-gray-400">
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-md font-medium text-gray-900">No results found</h3>
      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters to find matching results.</p>
    </div>
  );
};

export default BlankState; 