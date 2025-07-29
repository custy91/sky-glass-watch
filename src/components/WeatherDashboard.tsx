import React, { useState } from 'react';
import { Cloud, Wind, Droplets, Eye, Thermometer, MapPin } from 'lucide-react';
import GoogleMap from './GoogleMap';
import WeatherTable from './WeatherTable';
import FlightTable from './FlightTable';
import AirportFilter from './AirportFilter';
import { weatherData, flightData, airports } from '../data/mockData';

const WeatherDashboard = () => {
  const [selectedAirport, setSelectedAirport] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState(null);

  const filteredWeatherData = selectedAirport === 'all' 
    ? weatherData 
    : weatherData.filter(item => item.airport === selectedAirport);

  const filteredFlightData = selectedAirport === 'all'
    ? flightData
    : flightData.filter(item => item.airport === selectedAirport);

  const handleMarkerClick = (airport) => {
    setSelectedMarker(airport);
    setSelectedAirport(airport.code);
  };

  const handleAirportFilterChange = (airportCode) => {
    setSelectedAirport(airportCode);
    if (airportCode === 'all') {
      setSelectedMarker(null);
    } else {
      const airport = airports.find(a => a.code === airportCode);
      setSelectedMarker(airport);
    }
  };

  // Get current weather data for selected airport
  const selectedAirportWeather = selectedMarker 
    ? weatherData.find(w => w.airport === selectedMarker.code)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-20"></div>
      
      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/20 border border-blue-400/30">
                <Cloud className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Aviation Weather Dashboard</h1>
                <p className="text-sm text-blue-200">Real-time weather monitoring and flight tracking</p>
              </div>
            </div>
            <AirportFilter 
              selectedAirport={selectedAirport}
              onAirportChange={handleAirportFilterChange}
              airports={airports}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-4 flex gap-4 h-[calc(100vh-120px)]">
        {/* Map Section */}
        <div className="flex-1 rounded-xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
          <GoogleMap 
            airports={airports}
            selectedAirport={selectedAirport}
            onMarkerSelect={handleMarkerClick}
            selectedMarker={selectedMarker}
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-3">
          {/* Weather Data */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl h-[50%]">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer className="w-4 h-4 text-blue-300" />
              <h2 className="text-lg font-semibold text-white">Weather Conditions</h2>
            </div>
            <WeatherTable data={filteredWeatherData} />
          </div>

          {/* Flight Information */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl h-[50%]">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-300" />
              <h2 className="text-lg font-semibold text-white">Flight Operations</h2>
            </div>
            <FlightTable data={filteredFlightData} />
          </div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="absolute top-28 left-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 shadow-2xl z-20">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-300" />
          <div>
            <p className="text-xs text-blue-200">Active Airports</p>
            <p className="text-sm font-semibold text-white">{airports.length}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Selected Airport Info - Fixed z-index */}
      {selectedMarker && (
        <div className="fixed bottom-4 left-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl min-w-[280px] z-50">
          <div className="space-y-3">
            {/* Airport Header */}
            <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
              <div className="p-1.5 rounded-full bg-cyan-400/20 border border-cyan-400/30">
                <MapPin className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{selectedMarker.name}</h3>
                <p className="text-xs text-blue-200">{selectedMarker.city}, {selectedMarker.country}</p>
                <p className="text-xs text-blue-300">Code: {selectedMarker.code}</p>
              </div>
            </div>
            
            {/* Weather Data */}
            {selectedAirportWeather && (
              <div>
                <p className="text-xs font-semibold text-blue-300 mb-2">Current Weather</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-orange-400" />
                    <span className="text-white">{selectedAirportWeather.temperature}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span className="text-white">{selectedAirportWeather.windSpeed} mph</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-white">{selectedAirportWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-purple-400" />
                    <span className="text-white">{selectedAirportWeather.visibility} mi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cloud className="w-3 h-3 text-gray-400" />
                    <span className="text-white">{selectedAirportWeather.cloudCover}% clouds</span>
                  </div>
                  <div className="text-xs text-blue-200">
                    {selectedAirportWeather.condition}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
