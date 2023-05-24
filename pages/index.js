import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [destinations, setDestinations] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(
      `/results?location1=${location1}&location2=${location2}&destinations=${destinations}&departureDate=${departureDate}&adults=${adults}`
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={location1}
          onChange={(e) => setLocation1(e.target.value)}
          placeholder="Location 1"
        />
        <input
          value={location2}
          onChange={(e) => setLocation2(e.target.value)}
          placeholder="Location 2"
        />
        <input
          value={destinations}
          onChange={(e) => setDestinations(e.target.value)}
          placeholder="Destinations (comma-separated)"
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          placeholder="Departure Date"
        />
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          placeholder="Adults"
          min="1"
        />
        <button type="submit">Find Flights</button>
      </form>
    </div>
  );
}
