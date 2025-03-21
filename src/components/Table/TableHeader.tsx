import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({ label, options, value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-600 text-sm">{label}:</span>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md py-1 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  </div>
);

const TableHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <h1 className="text-xl font-medium text-gray-800">Available Analytics and Requests</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Filter
            label="Request type"
            options={[{ label: 'All', value: 'all' }]}
            value="all"
            onChange={() => {}}
          />
          <Filter
            label="Analytic type"
            options={[{ label: 'All', value: 'all' }]}
            value="all"
            onChange={() => {}}
          />
          <Filter
            label="Source"
            options={[{ label: 'All', value: 'all' }]}
            value="all"
            onChange={() => {}}
          />
          <Filter
            label="Role"
            options={[{ label: 'All', value: 'all' }]}
            value="all"
            onChange={() => {}}
          />
          <Filter
            label="Assigned to"
            options={[{ label: 'All', value: 'all' }]}
            value="all"
            onChange={() => {}}
          />
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default TableHeader;