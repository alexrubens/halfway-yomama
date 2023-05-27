// pages/api/flights.js
import https from 'https';

export default async function handler(req, res) {
  try {
    const options = {
      hostname: 'api.duffel.com',
      path: '/air/offers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer duffel_test_WwnYMQcLzJFoeTPC2wXmETzduJ-_M1gcGx57-nTyUuv',
      },
    };

    const duffelReq = https.request(options, (duffelRes) => {
      let data = '';

      duffelRes.on('data', (chunk) => {
        data += chunk;
      });

      duffelRes.on('end', () => {
        const flights = JSON.parse(data).data;
        const cheapestFlight = flights.reduce((cheapest, flight) => {
          if (
            !cheapest ||
            flight.offer_price.total < cheapest.offer_price.total
          ) {
            return flight;
          }
          return cheapest;
        }, null);

        res.status(200).json(cheapestFlight);
      });
    });

    duffelReq.on('error', (error) => {
      console.error(error);
    });

    duffelReq.write(
      JSON.stringify({
        data: {
          passengers: [{ type: 'adult' }],
          slices: [
            {
              origin: 'airport:LHR',
              destination: 'airport:JFK',
              departure_date: '2023-05-01',
            },
          ],
          cabin_class: 'economy',
          currency: 'USD',
        },
      })
    );

    duffelReq.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching flights' });
  }
}
