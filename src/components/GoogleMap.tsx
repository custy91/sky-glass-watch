
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plane } from 'lucide-react';

const GoogleMap = ({ airports, selectedAirport, onMarkerSelect, selectedMarker }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Mock Google Maps implementation for demo
  useEffect(() => {
    if (!mapRef.current) return;

    // This would be replaced with actual Google Maps API
    console.log('Google Maps would be initialized here');
    
    // Simulate map initialization
    const mockMap = {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 6
    };
    setMap(mockMap);
  }, []);

  const handleAirportClick = (airport) => {
    onMarkerSelect(airport);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-900/20 to-slate-900/20">
      {/* Map Container - In real implementation, this would be the Google Maps container */}
      <div ref={mapRef} className="w-full h-full relative overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-slate-800/30">
          {/* Grid overlay for map-like appearance */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJtYXAtZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjbWFwLWdyaWQpIi8+Cjwvc3ZnPg==')] opacity-30"></div>
        </div>

        {/* Mock Airport Markers */}
        {airports.map((airport, index) => {
          const isSelected = selectedMarker?.code === airport.code;
          const isFiltered = selectedAirport === 'all' || selectedAirport === airport.code;
          
          // Mock positioning based on index
          const positions = [
            { top: '20%', left: '25%' }, // JFK
            { top: '35%', left: '15%' }, // LAX
            { top: '45%', left: '70%' }, // LHR
            { top: '60%', left: '40%' }, // DXB
            { top: '25%', left: '60%' }, // NRT
          ];
          
          const position = positions[index] || { top: '50%', left: '50%' };
          
          return (
            <div
              key={airport.code}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                isFiltered ? 'opacity-100 scale-100' : 'opacity-50 scale-75'
              }`}
              style={position}
              onClick={() => handleAirportClick(airport)}
            >
              <div className={`relative ${isSelected ? 'animate-pulse' : ''}`}>
                <div className={`p-3 rounded-full backdrop-blur-md border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-cyan-400/30 border-cyan-400 shadow-lg shadow-cyan-400/25' 
                    : 'bg-blue-500/20 border-blue-400/50 hover:bg-blue-500/30 hover:border-blue-400'
                }`}>
                  <Plane className={`w-6 h-6 transition-colors duration-300 ${
                    isSelected ? 'text-cyan-300' : 'text-blue-300'
                  }`} />
                </div>
                
                {/* Airport Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                  <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-lg px-2 py-1">
                    <p className="text-xs font-semibold text-white">{airport.code}</p>
                    <p className="text-xs text-blue-200">{airport.city}</p>
                  </div>
                </div>
                
                {/* Selection Ring */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping"></div>
                )}
              </div>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-2">
            <button className="block w-8 h-8 text-white hover:text-blue-300 transition-colors">+</button>
          </div>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-2">
            <button className="block w-8 h-8 text-white hover:text-blue-300 transition-colors">-</button>
          </div>
        </div>
      </div>

      {/* Selected Airport Info */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-cyan-400/20 border border-cyan-400/30">
              <MapPin className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{selectedMarker.name}</h3>
              <p className="text-sm text-blue-200">{selectedMarker.city}, {selectedMarker.country}</p>
              <p className="text-xs text-blue-300">Code: {selectedMarker.code}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
