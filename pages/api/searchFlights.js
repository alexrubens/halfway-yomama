// pages/api/searchFlights.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { location1, location2, destinations, departureDate, adults } = req.body;
  
      // Your Amadeus API credentials
      const apiKey = 'Z38kFL4gr2OGGPq6tG4ZOX7tayurhDfF';
      const apiSecret = '33r8UF8KI38pmuN0';
  
      // Fetch the access token
      const tokenResponse = await fetch(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
        }
      );
      const { access_token } = await tokenResponse.json();
  
      let flightData = {};
  
      for (const destination of destinations) {
        const response1 = await fetch(
          `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${location1}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
          {
            headers: {
              Authorization: 'Bearer ' + access_token,
            },
          }
        );
        const data1 = await response1.json();
  
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        const response2 = await fetch(
          `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${location2}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
          {
            headers: {
              Authorization: 'Bearer ' + access_token,
            },
          }
        );
        const data2 = await response2.json();
  
        if (data1.data && data1.data[0] && data2.data && data2.data[0]) {
          if (!flightData[destination]) flightData[destination] = {};
          flightData[destination].location1 = {
            total: parseFloat(data1.data[0].price.total),
            flight: data1.data[0],
          };
          flightData[destination].location2 = {
            total: parseFloat(data2.data[0].price.total),
            flight: data2.data[0],
          };
        }
      }
  
      res.status(200).json({ flightData });
    } else {
      res.status(405).json({ message: 'We only accept POST' });
    }
  }
  