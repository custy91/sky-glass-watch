
import React, { useState } from 'react';
import { Plane, Clock, MapPin, ArrowUp, ArrowDown, Search } from 'lucide-react';

const FlightTable = ({ data }) => {
  const [activeTab, setActiveTab] = useState('arrivals');
  const [searchTerm, setSearchTerm] = useState('');

  const arrivals = data.filter(flight => flight.type === 'arrival');
  const departures = data.filter(flight => flight.type === 'departure');

  const filterFlights = (flights) => {
    return flights.filter(flight => 
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'text-green-400 bg-green-400/20';
      case 'delayed':
        return 'text-red-400 bg-red-400/20';
      case 'boarding':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'scheduled':
        return 'text-blue-400 bg-blue-400/20';
      case 'departed':
        return 'text-gray-400 bg-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderFlights = (flights) => {
    const filteredFlights = filterFlights(flights);
    
    return (
      <div className="space-y-1 max-h-44 overflow-y-auto">
        {filteredFlights.map((flight, index) => (
          <div 
            key={index}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-1.5 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <div className="p-0.5 rounded bg-blue-500/20">
                  <Plane className="w-3 h-3 text-blue-300" />
                </div>
                <span className="text-xs font-semibold text-white">{flight.flightNumber}</span>
              </div>
              <span className={`text-xs px-1 py-0.5 rounded-full border ${getStatusColor(flight.status)}`}>
                {flight.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                <span className="text-blue-200 truncate">{flight.origin}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span className="text-white">{flight.time}</span>
              </div>
            </div>
            
            <div className="mt-1 text-xs text-blue-300">
              Gate {flight.gate}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-blue-300" />
        <input
          type="text"
          placeholder="Search flights..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-7 pr-2 py-1 text-xs backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-0.5">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
            activeTab === 'arrivals'
              ? 'bg-blue-500/30 text-white border border-blue-400/30'
              : 'text-blue-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <ArrowDown className="w-3 h-3" />
          <span>Arrivals</span>
        </button>
        <button
          onClick={() => setActiveTab('departures')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
            activeTab === 'departures'
              ? 'bg-blue-500/30 text-white border border-blue-400/30'
              : 'text-blue-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <ArrowUp className="w-3 h-3" />
          <span>Departures</span>
        </button>
      </div>

      {/* Flight Lists */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'arrivals' && renderFlights(arrivals)}
        {activeTab === 'departures' && renderFlights(departures)}
      </div>
    </div>
  );
};

export default FlightTable;
