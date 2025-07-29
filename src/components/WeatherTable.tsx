
import React from 'react';
import { Thermometer, Wind, Droplets, Eye, CloudRain } from 'lucide-react';

const WeatherTable = ({ data }) => {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <div className="w-6 h-6 rounded-full bg-yellow-400"></div>;
      case 'cloudy':
        return <CloudRain className="w-5 h-5 text-gray-400" />;
      case 'rainy':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-400"></div>;
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
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {data.map((item, index) => (
        <div 
          key={index}
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-blue-300">{item.airport}</span>
              {getWeatherIcon(item.condition)}
            </div>
            <span className="text-xs text-blue-200">{item.time}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-white">{item.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-white">{item.windSpeed} mph</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-white">{item.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-white">{item.visibility} mi</span>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className={`text-xs font-medium ${getConditionColor(item.condition)}`}>
              {item.condition}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherTable;
