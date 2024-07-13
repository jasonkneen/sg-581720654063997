import React from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

export default function DateRangeFilter({ dateRange, setDateRange }) {
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <Label>Filter by Date Range</Label>
      <div className="flex space-x-2">
        <DatePicker
          selected={dateRange.from}
          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
          placeholderText="From"
        />
        <DatePicker
          selected={dateRange.to}
          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
          placeholderText="To"
          minDate={dateRange.from}
        />
      </div>
    </div>
  );
}