
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=marker`;
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
          if (markerObj.marker && markerObj.marker.map) {
            markerObj.marker.map = null;
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
        mapId: 'aviation-weather-map', // Required for Advanced Markers
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

  const createMarkerElement = (airport: any, isSelected: boolean) => {
    const markerColor = getMarkerColor(airport.code);
    
    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cssText = `
      position: relative;
      width: 32px;
      height: 32px;
      cursor: pointer;
      transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
      transition: transform 0.3s ease;
    `;

    // Create the pin container
    const pinContainer = document.createElement('div');
    pinContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create the pin background
    const pinBackground = document.createElement('div');
    pinBackground.style.cssText = `
      position: absolute;
      width: 24px;
      height: 24px;
      background-color: ${markerColor === 'red' ? '#ef4444' : '#3b82f6'};
      border: 2px solid ${isSelected ? '#00ffff' : '#ffffff'};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;

    // Create the icon
    const icon = document.createElement('div');
    icon.style.cssText = `
      position: relative;
      z-index: 2;
      color: white;
      font-size: 12px;
      transform: rotate(45deg);
    `;
    icon.innerHTML = '✈️';

    pinContainer.appendChild(pinBackground);
    pinContainer.appendChild(icon);
    markerElement.appendChild(pinContainer);

    return markerElement;
  };

  const createMarkers = (mapInstance: any) => {
    console.log('Creating markers for airports:', airports);
    
    // Clear existing markers
    markersRef.current.forEach(markerObj => {
      if (markerObj.marker && markerObj.marker.map) {
        markerObj.marker.map = null;
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
      const isSelected = selectedMarker?.code === airport.code;

      try {
        const markerElement = createMarkerElement(airport, isSelected);
        
        // Use AdvancedMarkerElement if available, fallback to regular Marker
        let marker;
        if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
          marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: position,
            map: mapInstance,
            title: `${airport.name} (${airport.code})`,
            content: markerElement
          });
        } else {
          // Fallback to regular marker if AdvancedMarkerElement is not available
          marker = new window.google.maps.Marker({
            position: position,
            map: mapInstance,
            title: `${airport.name} (${airport.code})`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C12.134 2 9 5.134 9 9c0 6.5 7 21 7 21s7-14.5 7-21c0-3.866-3.134-7-7-7z" 
                        fill="${getMarkerColor(airport.code) === 'red' ? '#ef4444' : '#3b82f6'}" 
                        stroke="${isSelected ? '#00ffff' : '#ffffff'}" 
                        stroke-width="2"/>
                  <text x="16" y="12" text-anchor="middle" fill="white" font-size="8">✈</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });
        }

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
      
      try {
        // If using AdvancedMarkerElement, update the content
        if (marker.content) {
          const newContent = createMarkerElement(airport, isSelected);
          marker.content = newContent;
        } else if (marker.setIcon) {
          // Fallback for regular markers
          const markerColor = getMarkerColor(airport.code);
          marker.setIcon({
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C12.134 2 9 5.134 9 9c0 6.5 7 21 7 21s7-14.5 7-21c0-3.866-3.134-7-7-7z" 
                      fill="${markerColor === 'red' ? '#ef4444' : '#3b82f6'}" 
                      stroke="${isSelected ? '#00ffff' : '#ffffff'}" 
                      stroke-width="2"/>
                <text x="16" y="12" text-anchor="middle" fill="white" font-size="8">✈</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(isSelected ? 40 : 32, isSelected ? 40 : 32)
          });
        }
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
                    <div className="relative">
                      <MapPin className={`w-6 h-6 transition-colors duration-300 ${
                        isSelected 
                          ? 'text-cyan-300' 
                          : markerColor === 'red' 
                          ? 'text-red-400' 
                          : 'text-blue-400'
                      }`} />
                      <Plane className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    
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
