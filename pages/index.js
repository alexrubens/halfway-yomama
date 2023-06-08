import { useState } from 'react';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import cityNames from '../data/CityNames';
import airlineNames from '../data/AirlineNames';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function HomePage() {
  const router = useRouter();
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState('');
  const [airlines, setAirlines] = useState(Object.keys(airlineNames));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const query = queryString.stringify({
      location1,
      location2,
      destination,
      departureDate,
      adults,
      airlines: airlines.join(','),
    });
    router.push('/cheapestonly?' + query);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Flight Search
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Location 1"
              value={location1}
              onChange={(e) => setLocation1(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              label="Location 2"
              value={location2}
              onChange={(e) => setLocation2(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              label="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              label="Departure Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              label="Adults"
              type="number"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Airlines</InputLabel>
              <Select
                multiple
                value={airlines}
                onChange={(e) => setAirlines(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {Object.entries(airlineNames).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox checked={airlines.indexOf(key) > -1} />
                    <ListItemText primary={value} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Search Flights
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;
