
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plane } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap = ({ airports, selectedAirport, onMarkerSelect, selectedMarker }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMarkers, setGoogleMarkers] = useState([]);

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 4,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#242f3e" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "lightness": -80 }]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#746855" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }]
          }
        ]
      });

      setMap(mapInstance);
      createMarkers(mapInstance);
    };

    loadGoogleMaps();
  }, []);

  // Create markers for airports
  const createMarkers = (mapInstance) => {
    const markers = [];
    
    airports.forEach((airport) => {
      // Mock coordinates - in real implementation, you'd have actual lat/lng
      const positions = {
        'JFK': { lat: 40.6413, lng: -73.7781 },
        'LAX': { lat: 33.9425, lng: -118.4081 },
        'LHR': { lat: 51.4700, lng: -0.4543 },
        'DXB': { lat: 25.2532, lng: 55.3657 },
        'NRT': { lat: 35.7720, lng: 140.3929 }
      };

      const position = positions[airport.code] || { lat: 0, lng: 0 };
      const markerColor = getMarkerColor(airport.code);

      const marker = new window.google.maps.Marker({
        position: position,
        map: mapInstance,
        title: `${airport.name} (${airport.code})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: markerColor === 'red' ? '#ef4444' : '#3b82f6',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        handleAirportClick(airport);
      });

      markers.push({ marker, airport });
    });

    setGoogleMarkers(markers);
  };

  // Update marker colors when selection changes
  useEffect(() => {
    googleMarkers.forEach(({ marker, airport }) => {
      const isSelected = selectedMarker?.code === airport.code;
      const markerColor = getMarkerColor(airport.code);
      
      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 12 : 8,
        fillColor: markerColor === 'red' ? '#ef4444' : '#3b82f6',
        fillOpacity: isSelected ? 1 : 0.8,
        strokeColor: isSelected ? '#00ffff' : '#ffffff',
        strokeWeight: isSelected ? 3 : 2
      });
    });
  }, [selectedMarker, googleMarkers]);

  const handleAirportClick = (airport) => {
    console.log('Airport clicked:', airport.code);
    onMarkerSelect(airport);
  };

  // Function to determine marker color based on weather conditions
  const getMarkerColor = (airportCode) => {
    const poorWeatherAirports = ['LHR'];
    return poorWeatherAirports.includes(airportCode) ? 'red' : 'blue';
  };

  // Fallback UI while Google Maps loads
  if (!map) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-blue-900/20 to-slate-900/20">
        <div ref={mapRef} className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-slate-800/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJtYXAtZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjbWFwLWdyaWQpIi8+Cjwvc3ZnPg==')] opacity-30"></div>
            
            {/* Mock Airport Markers for fallback */}
            {airports.map((airport, index) => {
              const isSelected = selectedMarker?.code === airport.code;
              const isFiltered = selectedAirport === 'all' || selectedAirport === airport.code;
              const markerColor = getMarkerColor(airport.code);
              
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
                    <Plane className={`w-5 h-5 transition-colors duration-300 ${
                      isSelected 
                        ? 'text-cyan-300' 
                        : markerColor === 'red' 
                        ? 'text-red-400' 
                        : 'text-blue-400'
                    }`} />
                    
                    {/* Airport Label */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                      <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded px-1 py-0.5">
                        <p className="text-xs font-semibold text-white">{airport.code}</p>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default GoogleMap;
