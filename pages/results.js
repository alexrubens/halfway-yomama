import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ResultsPage() {
  const router = useRouter();
  const { location1, location2, destinations, departureDate, adults } =
    router.query;

  const [flights, setFlights] = useState({});

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
        }

        setFlights(flightData);
      };

      fetchData();
    }
  }, [location1, location2, destinations, departureDate, adults]);

  return (
    <div>
      <h1>Results</h1>
      {Object.entries(flights).map(([location, flightInfos]) => (
        <div key={location}>
          <h2>Flights from {location}</h2>
          {flightInfos.map((flightInfo, index) => (
            <div key={index}>
              <h3>Destination: {flightInfo.destination}</h3>
              <p>Price: {flightInfo.flight.price.total}</p>
              <h4>Flight Details:</h4>
              <p>Duration: {flightInfo.flight.itineraries[0].duration}</p>
              <p>
                Number of Stops:{' '}
                {flightInfo.flight.itineraries[0].segments.length - 1}
              </p>
              <p>
                Airline:{' '}
                {flightInfo.flight.itineraries[0].segments[0].carrierCode}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ResultsPage;
