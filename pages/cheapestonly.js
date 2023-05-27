// pages/cheapestonly.js
import { useEffect, useState } from 'react';

export default function CheapestOnly({ cheapestFlight }) {
  const [flight, setFlight] = useState(cheapestFlight);

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await fetch('http://localhost:3000/api/flights');
      const data = await res.json();
      setFlight(data);
    };

    if (!flight) {
      fetchFlights();
    }
  }, []);

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Cheapest Flight</h1>
      <p>
        From {flight.origin} to {flight.destination}
      </p>
      <p>Price: {flight.offer_price.total}</p>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/flights');
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { cheapestFlight: data }, // will be passed to the page component as props
  };
}
