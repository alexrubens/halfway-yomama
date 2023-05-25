import { useState } from 'react';
import { useRouter } from 'next/router';

const cityNames = {
  LAX: 'Los Angeles, CA (LAX)',
  SFO: 'San Francisco, CA (SFO)',
  SEA: 'Seattle, WA (SEA)',
  DFW: 'Dallas, TX (DFW)',
  MIA: 'Miami, FL (MIA)',
  LAS: 'Las Vegas, NV (LAS)',
  JFK: 'New York, NY (JFK)',
};

const airlineCodes = {
  AA: 'American Airlines',
  DL: 'Delta Airlines',
  UA: 'United Airlines',
  B6: 'JetBlue Airways',
  WN: 'Southwest Airlines',
  AS: 'Alaska Airlines',
  NK: 'Spirit Airlines',
  F9: 'Frontier Airlines',
};

export default function HomePage() {
  const router = useRouter();
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [destinations, setDestinations] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState('');
  const [cheapestOnly, setCheapestOnly] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState(
    Object.keys(airlineCodes)
  );

  const handleAirlineSelection = (airline) => {
    setSelectedAirlines((prevSelectedAirlines) =>
      prevSelectedAirlines.includes(airline)
        ? prevSelectedAirlines.filter((a) => a !== airline)
        : [...prevSelectedAirlines, airline]
    );
  };

  const submitHandler = (event) => {
    event.preventDefault();
    router.push({
      pathname: cheapestOnly ? '/cheapestonly' : '/results',
      query: {
        location1,
        location2,
        destinations,
        departureDate,
        adults,
        airlines: selectedAirlines.join(','),
      },
    });
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h1>Find Your Flight</h1>
        <input
          type="text"
          required
          placeholder="Location 1"
          value={location1}
          onChange={(e) => setLocation1(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Location 2"
          value={location2}
          onChange={(e) => setLocation2(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Destinations"
          value={destinations}
          onChange={(e) => setDestinations(e.target.value)}
        />
        <input
          type="date"
          required
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
        <input
          type="number"
          required
          placeholder="Number of Adults"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
        />
        <div>
          <label>Search for cheapest flight only</label>
          <input
            type="checkbox"
            checked={cheapestOnly}
            onChange={(e) => setCheapestOnly(e.target.checked)}
          />
        </div>
        <div>
          <label>Select Airlines</label>
          {Object.entries(airlineCodes).map(([code, name]) => (
            <div key={code}>
              <input
                type="checkbox"
                checked={selectedAirlines.includes(code)}
                onChange={() => handleAirlineSelection(code)}
              />
              <label>{name}</label>
            </div>
          ))}
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
