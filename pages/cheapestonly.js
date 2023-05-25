import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import cityNames from '../data/CityNames';
import airlineNames from '../data/AirlineNames';

function CheapestOnlyPage() {
  const router = useRouter();
  const { location1, location2, destinations, departureDate, adults } =
    router.query;

  const [flights, setFlights] = useState({});
  const [cheapestFlights, setCheapestFlights] = useState({});
  const [searchProgress, setSearchProgress] = useState(0);
  const [cheapestDestination, setCheapestDestination] = useState(null);

  useEffect(() => {
    if (location1 && location2 && destinations && departureDate && adults) {
      const apiKey = 'Z38kFL4gr2OGGPq6tG4ZOX7tayurhDfF';
      const apiSecret = '33r8UF8KI38pmuN0';
      const destinationList = destinations
        .split(',')
        .map((destination) => destination.trim());
      const flightData = {};

      const fetchData = async () => {
        const tokenResponse = await fetch(
          'https://test.api.amadeus.com/v1/security/oauth2/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
          }
        );
        const { access_token } = await tokenResponse.json();

        let completedSearches = 0;

        for (const destination of destinationList) {
          const response1 = await fetch(
            `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${location1}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
            {
              headers: {
                Authorization: 'Bearer ' + access_token,
              },
            }
          );
          const data1 = await response1.json();
          const response2 = await fetch(
            `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${location2}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
            {
              headers: {
                Authorization: 'Bearer ' + access_token,
              },
            }
          );
          const data2 = await response2.json();
          if (data1.data && data1.data[0]) {
            if (!flightData[location1]) flightData[location1] = [];
            flightData[location1].push({
              destination,
              flight: data1.data[0],
            });
          }
          if (data2.data && data2.data[0]) {
            if (!flightData[location2]) flightData[location2] = [];
            flightData[location2].push({
              destination,
              flight: data2.data[0],
            });
          }

          completedSearches++;
          setSearchProgress((completedSearches / destinationList.length) * 100);
        }

        if (Object.keys(flightData).length) {
          const cheapestFlightsData = {};

          for (const [location, flightInfos] of Object.entries(flightData)) {
            cheapestFlightsData[location] = flightInfos.reduce(
              (prev, current) =>
                prev.flight.price.total < current.flight.price.total
                  ? prev
                  : current
            );
          }

          const combined = Object.values(cheapestFlightsData).reduce((a, b) => {
            const totalA = parseFloat(a.flight.price.total);
            const totalB = parseFloat(b.flight.price.total);
            return totalA < totalB ? a : b;
          });

          const totalCost = Object.values(cheapestFlightsData).reduce(
            (total, flightInfo) => {
              return total + parseFloat(flightInfo.flight.price.total);
            },
            0
          );

          setCheapestDestination({ ...combined, totalCost });
          setFlights(flightData);
          setCheapestFlights(cheapestFlightsData);
        }
      };

      fetchData();
    }
  }, [location1, location2, destinations, departureDate, adults]);

  return (
    <div>
      <h1>Cheapest Flights Only</h1>
      <div>
        <div
          style={{
            width: `${searchProgress}%`,
            backgroundColor: 'green',
            height: '20px',
          }}
        ></div>
      </div>
      <p>{`Progress: ${Math.round(searchProgress)}%`}</p>
      {Object.entries(cheapestFlights).map(([location, flightInfo]) => (
        <div key={location}>
          <h2>Flights from {cityNames[location] || location}</h2>
          <h3>
            Destination:{' '}
            {cityNames[flightInfo.destination] || flightInfo.destination}
          </h3>
          <p>Price: {flightInfo.flight.price.total}</p>
          <h4>Flight Details:</h4>
          <p>Duration: {flightInfo.flight.itineraries[0].duration}</p>
          <p>
            Number of Stops:{' '}
            {flightInfo.flight.itineraries[0].segments.length - 1}
          </p>
          <p>
            Airline:{' '}
            {airlineNames[
              flightInfo.flight.itineraries[0].segments[0].carrierCode
            ] || flightInfo.flight.itineraries[0].segments[0].carrierCode}
          </p>
        </div>
      ))}
      {cheapestDestination && (
        <div>
          <h2>
            Cheapest Overall Destination:{' '}
            {cityNames[cheapestDestination.destination] ||
              cheapestDestination.destination}
          </h2>
          <h3>Total Cost: {cheapestDestination.totalCost.toFixed(2)}</h3>
          <h3>
            Average Cost (If Split Evenly):{' '}
            {(cheapestDestination.totalCost / 2).toFixed(2)}
          </h3>
        </div>
      )}
    </div>
  );
}

export default CheapestOnlyPage;
