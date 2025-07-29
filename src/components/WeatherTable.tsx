
import React, { useState } from 'react';
import { Thermometer, Wind, Droplets, Eye, CloudRain, Search } from 'lucide-react';

const WeatherTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    item.airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <div className="w-4 h-4 rounded-full bg-yellow-400"></div>;
      case 'cloudy':
        return <CloudRain className="w-4 h-4 text-gray-400" />;
      case 'rainy':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'text-green-400';
      case 'cloudy':
        return 'text-yellow-400';
      case 'rainy':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-blue-300" />
        <input
          type="text"
          placeholder="Search airports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-7 pr-2 py-1 text-xs backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Weather Data */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredData.map((item, index) => (
          <div 
            key={index}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-blue-300">{item.airport}</span>
                {getWeatherIcon(item.condition)}
              </div>
              <span className="text-xs text-blue-200">{item.time}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="flex items-center space-x-1">
                <Thermometer className="w-3 h-3 text-orange-400" />
                <span className="text-white">{item.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span className="text-white">{item.windSpeed} mph</span>
              </div>
              <div className="flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span className="text-white">{item.humidity}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-purple-400" />
                <span className="text-white">{item.visibility} mi</span>
              </div>
            </div>
            
            <div className="mt-1 pt-1 border-t border-white/10">
              <span className={`text-xs font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherTable;
