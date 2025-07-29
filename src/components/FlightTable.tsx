
import React, { useState } from 'react';
import { Plane, Clock, MapPin, ArrowUp, ArrowDown } from 'lucide-react';

const FlightTable = ({ data }) => {
  const [activeTab, setActiveTab] = useState('arrivals');

  const arrivals = data.filter(flight => flight.type === 'arrival');
  const departures = data.filter(flight => flight.type === 'departure');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'text-green-400 bg-green-400/20';
      case 'delayed':
        return 'text-red-400 bg-red-400/20';
      case 'boarding':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'departed':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderFlights = (flights) => (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {flights.map((flight, index) => (
        <div 
          key={index}
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-blue-500/20">
                <Plane className="w-4 h-4 text-blue-300" />
              </div>
              <span className="text-sm font-semibold text-white">{flight.flightNumber}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(flight.status)}`}>
              {flight.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span className="text-blue-200">{flight.origin}</span>
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

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
            activeTab === 'arrivals'
              ? 'bg-blue-500/30 text-white border border-blue-400/30'
              : 'text-blue-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <ArrowDown className="w-4 h-4" />
          <span>Arrivals</span>
        </button>
        <button
          onClick={() => setActiveTab('departures')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
            activeTab === 'departures'
              ? 'bg-blue-500/30 text-white border border-blue-400/30'
              : 'text-blue-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
          <span>Departures</span>
        </button>
      </div>

      {/* Flight Lists */}
      {activeTab === 'arrivals' && renderFlights(arrivals)}
      {activeTab === 'departures' && renderFlights(departures)}
    </div>
  );
};

export default FlightTable;
