import { useRouter } from 'next/router';
import cityNames from '../data/CityNames';
import airlineNames from '../data/AirlineNames';
import flights from '../data/Flights';

function CheapestOnlyPage() {
  const router = useRouter();
  const {
    location1,
    location2,
    destinations,
    departureDate,
    adults,
    airlines,
  } = router.query;

  // Assuming cityNames is a dictionary of {cityCode: cityName}, let's get the city codes for location1 and location2
  const location1Code = Object.keys(cityNames).find(
    (code) => cityNames[code] === location1
  );
  const location2Code = Object.keys(cityNames).find(
    (code) => cityNames[code] === location2
  );

  // Check if location codes exist
  if (!location1Code || !location2Code) {
    return (
      <div>
        <h1>No matching locations found</h1>
        <p>Please adjust your search criteria.</p>
      </div>
    );
  }

  const destinationList =
    destinations && destinations.length > 0
      ? destinations.split(',').map((destination) => destination.trim())
      : Object.keys(cityNames);
  const selectedAirlines = airlines ? airlines.split(',') : [];

  let filteredFlights = flights;

  // Apply airline filter
  if (selectedAirlines && selectedAirlines.length > 0) {
    filteredFlights = filteredFlights.filter((flight) =>
      selectedAirlines.includes(flight.airline)
    );
  }

  let flightsFromLocation1 = filteredFlights.filter(
    (flight) => flight.originCityCode === location1Code
  );
  let flightsFromLocation2 = filteredFlights.filter(
    (flight) => flight.originCityCode === location2Code
  );

  let mutualDestinations = flightsFromLocation1
    .map((flight) => flight.destinationCityCode)
    .filter((destination) =>
      flightsFromLocation2.some(
        (flight) => flight.destinationCityCode === destination
      )
    );

  flightsFromLocation1 = flightsFromLocation1.filter((flight) =>
    mutualDestinations.includes(flight.destinationCityCode)
  );

  flightsFromLocation2 = flightsFromLocation2.filter((flight) =>
    mutualDestinations.includes(flight.destinationCityCode)
  );

  if (flightsFromLocation1.length === 0 || flightsFromLocation2.length === 0) {
    return (
      <div>
        <h1>No matching flights found</h1>
        <p>Please adjust your search criteria.</p>
      </div>
    );
  }

  const cheapestFlightFromLocation1 = flightsFromLocation1.reduce(
    (prev, current) => (prev.price < current.price ? prev : current),
    flightsFromLocation1[0]
  );

  const cheapestFlightFromLocation2 = flightsFromLocation2.reduce(
    (prev, current) => (prev.price < current.price ? prev : current),
    flightsFromLocation2[0]
  );

  const cheapestOverallDestination =
    cheapestFlightFromLocation1.price < cheapestFlightFromLocation2.price
      ? cheapestFlightFromLocation1.destinationCityCode
      : cheapestFlightFromLocation2.destinationCityCode;

  const totalCost =
    cheapestFlightFromLocation1.price + cheapestFlightFromLocation2.price;

  const averageCost = totalCost / 2;

  return (
    <div>
      <h1>Cheapest Flights Only</h1>
      <p>Progress: 100%</p>
      <h2>Flights from {location1}</h2>
      <p>Destination: {cheapestFlightFromLocation1.destinationCityCode}</p>
      <p>Price: {cheapestFlightFromLocation1.price}</p>
      <p>Flight Details:</p>
      <p>Duration: {cheapestFlightFromLocation1.duration}</p>
      <p>Number of Stops: {cheapestFlightFromLocation1.stops}</p>
      <p>Airline: {airlineNames[cheapestFlightFromLocation1.airline]}</p>

      <h2>Flights from {location2}</h2>
      <p>Destination: {cheapestFlightFromLocation2.destinationCityCode}</p>
      <p>Price: {cheapestFlightFromLocation2.price}</p>
      <p>Flight Details:</p>
      <p>Duration: {cheapestFlightFromLocation2.duration}</p>
      <p>Number of Stops: {cheapestFlightFromLocation2.stops}</p>
      <p>Airline: {airlineNames[cheapestFlightFromLocation2.airline]}</p>

      <h2>Cheapest Overall Destination: {cheapestOverallDestination}</h2>
      <p>Total Cost: {totalCost}</p>
      <p>Average Cost (If Split Evenly): {averageCost}</p>
    </div>
  );
}
export default CheapestOnlyPage;
