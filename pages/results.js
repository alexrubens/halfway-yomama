import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ResultsPage() {
  const router = useRouter();
  const { location1, location2, destinations, departureDate, adults } =
    router.query;

  const [flights, setFlights] = useState([]);

  useEffect(() => {
    if (location1 && location2 && destinations && departureDate && adults) {
      const destinationList = destinations
        .split(',')
        .map((destination) => destination.trim());

      const fetchData = async () => {
        // Acquiring the access token
        const responseToken = await fetch(
          'https://test.api.amadeus.com/v1/security/oauth2/token',
          {
            method: 'POST',
            body: new URLSearchParams({
              client_id: 'Z38kFL4gr2OGGPq6tG4ZOX7tayurhDfF',
              client_secret: '33r8UF8KI38pmuN0',
              grant_type: 'client_credentials',
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const dataToken = await responseToken.json();
        const accessToken = dataToken.access_token;

        const baseUrl =
          'https://test.api.amadeus.com/v2/shopping/flight-offers';

        const flightData = [];

        for (const destination of destinationList) {
          const response1 = await fetch(
            `${baseUrl}?originLocationCode=${location1}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data1 = await response1.json();

          const response2 = await fetch(
            `${baseUrl}?originLocationCode=${location2}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data2 = await response2.json();

          if (data1.data && data1.data[0]) {
            flightData.push({
              location: location1,
              destination,
              flight: data1.data[0],
            });
          }
          if (data2.data && data2.data[0]) {
            flightData.push({
              location: location2,
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
      {flights.map((flightInfo, index) => (
        <div key={index}>
          <h2>
            Flight from {flightInfo.location} to {flightInfo.destination}
          </h2>
          <p>Price: {flightInfo.flight.price.total}</p>
        </div>
      ))}
    </div>
  );
}

export default ResultsPage;
