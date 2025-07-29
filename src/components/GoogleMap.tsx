
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plane } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap = ({ airports, selectedAirport, onMarkerSelect, selectedMarker }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);

  // Check if Google Maps is already loaded
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Only load script if not already loaded
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded');
        setIsGoogleMapsLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setIsGoogleMapsLoaded(false);
      };

      document.head.appendChild(script);
    }

    return () => {
      // Cleanup function to prevent memory leaks
      if (map) {
        // Clear all markers
        markersRef.current.forEach(markerObj => {
          if (markerObj.marker) {
            markerObj.marker.setMap(null);
          }
        });
        markersRef.current = [];
      }
    };
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (isGoogleMapsLoaded && mapRef.current && !map) {
      console.log('Initializing Google Maps');
      initializeMap();
    }
  }, [isGoogleMapsLoaded, map]);

  // Update markers when selection changes
  useEffect(() => {
    if (map && markersRef.current.length > 0) {
      updateMarkerStyles();
    }
  }, [selectedMarker, map]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      console.error('Map container or Google Maps not available');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  };

  const createMarkers = (mapInstance: any) => {
    console.log('Creating markers for airports:', airports);
    
    // Clear existing markers
    markersRef.current.forEach(markerObj => {
      if (markerObj.marker) {
        markerObj.marker.setMap(null);
      }
    });
    markersRef.current = [];
    
    const positions = {
      'JFK': { lat: 40.6413, lng: -73.7781 },
      'LAX': { lat: 33.9425, lng: -118.4081 },
      'LHR': { lat: 51.4700, lng: -0.4543 },
      'DXB': { lat: 25.2532, lng: 55.3657 },
      'NRT': { lat: 35.7720, lng: 140.3929 }
    };

    airports.forEach((airport) => {
      const position = positions[airport.code] || { lat: 0, lng: 0 };
      const markerColor = getMarkerColor(airport.code);

      try {
        const marker = new window.google.maps.Marker({
          position: position,
          map: mapInstance,
          title: `${airport.name} (${airport.code})`,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: markerColor === 'red' ? '#ef4444' : '#3b82f6',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 1,
            rotation: 45
          }
        });

        marker.addListener('click', () => {
          console.log('Airport marker clicked:', airport.code);
          handleAirportClick(airport);
        });

        markersRef.current.push({ marker, airport });
      } catch (error) {
        console.error('Error creating marker for airport:', airport.code, error);
      }
    });
  };

  const updateMarkerStyles = () => {
    markersRef.current.forEach(({ marker, airport }) => {
      const isSelected = selectedMarker?.code === airport.code;
      const markerColor = getMarkerColor(airport.code);
      
      try {
        marker.setIcon({
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: isSelected ? 8 : 6,
          fillColor: markerColor === 'red' ? '#ef4444' : '#3b82f6',
          fillOpacity: isSelected ? 1 : 0.8,
          strokeColor: isSelected ? '#00ffff' : '#ffffff',
          strokeWeight: isSelected ? 2 : 1,
          rotation: 45
        });
      } catch (error) {
        console.error('Error updating marker style:', airport.code, error);
      }
    });
  };

  const handleAirportClick = (airport: any) => {
    console.log('Airport clicked:', airport.code);
    onMarkerSelect(airport);
  };

  const getMarkerColor = (airportCode: string) => {
    const poorWeatherAirports = ['LHR'];
    return poorWeatherAirports.includes(airportCode) ? 'red' : 'blue';
  };

  // Always render fallback UI
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-900/20 to-slate-900/20">
      <div ref={mapRef} className="w-full h-full relative overflow-hidden">
        {!isGoogleMapsLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-slate-800/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJtYXAtZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjbWFwLWdyaWQpIi8+Cjwvc3ZnPg==')] opacity-30"></div>
            
            {airports.map((airport, index) => {
              const isSelected = selectedMarker?.code === airport.code;
              const isFiltered = selectedAirport === 'all' || selectedAirport === airport.code;
              const markerColor = getMarkerColor(airport.code);
              
              const positions = [
                { top: '20%', left: '25%' },
                { top: '35%', left: '15%' },
                { top: '45%', left: '70%' },
                { top: '60%', left: '40%' },
                { top: '25%', left: '60%' },
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
                    
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                      <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded px-1 py-0.5">
                        <p className="text-xs font-semibold text-white">{airport.code}</p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMap;
