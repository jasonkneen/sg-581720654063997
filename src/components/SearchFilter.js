import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function SearchFilter({ filters, onUpdateFilters }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdateFilters({ [name]: value });
  };

  const handleDateChange = (field) => (date) => {
    onUpdateFilters({
      dateRange: { ...filters.dateRange, [field]: date }
    });
  };

  return (
    <div className="space-y-4" role="search" aria-label="Filter catches">
      <div>
        <Label htmlFor="searchTerm">Search</Label>
        <Input
          id="searchTerm"
          name="searchTerm"
          type="text"
          placeholder="Search catches..."
          value={filters.searchTerm}
          onChange={handleInputChange}
          aria-label="Search term for filtering catches"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={handleInputChange}
            aria-label="Filter catches by location"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            name="species"
            type="text"
            placeholder="Filter by species"
            value={filters.species}
            onChange={handleInputChange}
            aria-label="Filter catches by species"
          />
        </div>
      </div>
      <div>
        <Label>Date Range</Label>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" aria-label="Select start date">
                {filters.dateRange.from ? (
                  format(filters.dateRange.from, "PPP")
                ) : (
                  <span>Pick a start date</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={handleDateChange('from')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" aria-label="Select end date">
                {filters.dateRange.to ? (
                  format(filters.dateRange.to, "PPP")
                ) : (
                  <span>Pick an end date</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={handleDateChange('to')}
                initialFocus
                disabled={(date) => date < filters.dateRange.from}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}