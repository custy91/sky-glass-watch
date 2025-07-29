
import React from 'react';
import { ChevronDown } from 'lucide-react';

const AirportFilter = ({ selectedAirport, onAirportChange, airports }) => {
  return (
    <div className="relative">
      <select 
        value={selectedAirport}
        onChange={(e) => onAirportChange(e.target.value)}
        className="appearance-none backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
      >
        <option value="all" className="bg-slate-800 text-white">All Airports</option>
        {airports.map((airport) => (
          <option 
            key={airport.code} 
            value={airport.code}
            className="bg-slate-800 text-white"
          >
            {airport.code} - {airport.city}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
    </div>
  );
};

export default AirportFilter;
