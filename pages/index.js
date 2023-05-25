import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [checkboxDestinations, setCheckboxDestinations] = useState({
    LAX: false,
    SFO: false,
    DFW: false,
    SEA: false,
    MIA: false,
    LAS: false,
    JFK: false,
  });
  const [additionalDestinations, setAdditionalDestinations] = useState('');
  const [cheapestOnly, setCheapestOnly] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDestinations = Object.keys(checkboxDestinations)
      .filter((destination) => checkboxDestinations[destination])
      .concat(additionalDestinations.split(',').map((d) => d.trim()))
      .join(',');

    router.push({
      pathname: cheapestOnly ? '/cheapestonly' : '/results',
      query: {
        location1,
        location2,
        destinations: selectedDestinations,
        departureDate,
        adults,
      },
    });
  };

  const handleCheckboxChange = (e) => {
    setCheckboxDestinations({
      ...checkboxDestinations,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Location 1 (IATA Code):
        <input
          type="text"
          value={location1}
          onChange={(e) => setLocation1(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Location 2 (IATA Code):
        <input
          type="text"
          value={location2}
          onChange={(e) => setLocation2(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Destinations (comma-separated):
        <input
          type="text"
          value={additionalDestinations}
          onChange={(e) => setAdditionalDestinations(e.target.value)}
        />
      </label>
      <div>
        {Object.keys(checkboxDestinations).map((destination) => (
          <label key={destination}>
            <input
              type="checkbox"
              name={destination}
              checked={checkboxDestinations[destination]}
              onChange={handleCheckboxChange}
            />
            {destination}
          </label>
        ))}
      </div>
      <br />
      <label>
        Departure Date:
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Number of Adults:
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          min="1"
          required
        />
      </label>
      <br />
      <label>
        Cheapest Only:
        <input
          type="checkbox"
          checked={cheapestOnly}
          onChange={(e) => setCheapestOnly(e.target.checked)}
        />
      </label>
      <br />
      <button type="submit">Search</button>
    </form>
  );
}
