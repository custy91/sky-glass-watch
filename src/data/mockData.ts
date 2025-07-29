
export const airports = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
];

export const weatherData = [
  {
    airport: 'JFK',
    temperature: 22,
    condition: 'Clear',
    windSpeed: 15,
    humidity: 65,
    visibility: 10,
    cloudCover: 15,
    time: '14:30'
  },
  {
    airport: 'LAX',
    temperature: 28,
    condition: 'Cloudy',
    windSpeed: 8,
    humidity: 72,
    visibility: 8,
    cloudCover: 75,
    time: '11:30'
  },
  {
    airport: 'LHR',
    temperature: 16,
    condition: 'Rainy',
    windSpeed: 22,
    humidity: 85,
    visibility: 5,
    cloudCover: 95,
    time: '19:30'
  },
  {
    airport: 'DXB',
    temperature: 35,
    condition: 'Clear',
    windSpeed: 12,
    humidity: 45,
    visibility: 15,
    cloudCover: 10,
    time: '22:30'
  },
  {
    airport: 'NRT',
    temperature: 18,
    condition: 'Cloudy',
    windSpeed: 18,
    humidity: 78,
    visibility: 7,
    cloudCover: 60,
    time: '03:30'
  },
  // Past 12 hours data
  {
    airport: 'JFK',
    temperature: 20,
    condition: 'Clear',
    windSpeed: 12,
    humidity: 62,
    visibility: 10,
    cloudCover: 20,
    time: '02:30'
  },
  {
    airport: 'LAX',
    temperature: 25,
    condition: 'Clear',
    windSpeed: 6,
    humidity: 68,
    visibility: 10,
    cloudCover: 25,
    time: '23:30'
  },
];

export const flightData = [
  // Future Arrivals
  {
    airport: 'JFK',
    type: 'arrival',
    flightNumber: 'AA 123',
    origin: 'LAX',
    time: '18:45',
    status: 'On Time',
    gate: 'A12'
  },
  {
    airport: 'JFK',
    type: 'arrival',
    flightNumber: 'DL 456',
    origin: 'LHR',
    time: '19:20',
    status: 'Delayed',
    gate: 'B5'
  },
  {
    airport: 'LAX',
    type: 'arrival',
    flightNumber: 'UA 789',
    origin: 'NRT',
    time: '16:15',
    status: 'On Time',
    gate: 'C8'
  },
  {
    airport: 'LHR',
    type: 'arrival',
    flightNumber: 'BA 321',
    origin: 'DXB',
    time: '22:10',
    status: 'Scheduled',
    gate: 'T2-15'
  },
  
  // Future Departures
  {
    airport: 'JFK',
    type: 'departure',
    flightNumber: 'AA 654',
    origin: 'DXB',
    time: '20:30',
    status: 'Boarding',
    gate: 'A8'
  },
  {
    airport: 'LAX',
    type: 'departure',
    flightNumber: 'DL 987',
    origin: 'LHR',
    time: '17:45',
    status: 'On Time',
    gate: 'B12'
  },
  {
    airport: 'LHR',
    type: 'departure',
    flightNumber: 'VS 234',
    origin: 'JFK',
    time: '23:55',
    status: 'Scheduled',
    gate: 'T3-22'
  },
  {
    airport: 'DXB',
    type: 'departure',
    flightNumber: 'EK 567',
    origin: 'NRT',
    time: '02:40',
    status: 'Delayed',
    gate: 'C18'
  },
  {
    airport: 'NRT',
    type: 'departure',
    flightNumber: 'JL 890',
    origin: 'LAX',
    time: '11:25',
    status: 'Scheduled',
    gate: 'D7'
  },
];
