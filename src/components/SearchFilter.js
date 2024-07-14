import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function SearchFilter({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [location, setLocation] = useState('');
  const [species, setSpecies] = useState('');

  const handleFilter = () => {
    onFilter({
      searchTerm,
      dateRange,
      location,
      species
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search catches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            type="text"
            placeholder="Filter by species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Date Range</Label>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {dateRange.from ? (
                  format(dateRange.from, "PPP")
                ) : (
                  <span>Pick a start date</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {dateRange.to ? (
                  format(dateRange.to, "PPP")
                ) : (
                  <span>Pick an end date</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button onClick={handleFilter}>Apply Filters</Button>
    </div>
  );
}