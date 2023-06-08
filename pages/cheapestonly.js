import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import cityNames from '../data/CityNames';
import airlineNames from '../data/AirlineNames';

const theme = createTheme();

function CheapestOnlyPage() {
  const [flights, setFlights] = useState(null);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const location1 = searchParams.get('location1');
        const location2 = searchParams.get('location2');
        const dest = searchParams.get('destination');
        setDestination(dest);
        const departureDate = searchParams.get('departureDate');
        const adults = searchParams.get('adults');
        const airlines = searchParams.getAll('airlines');

        const apiKey = 'Z38kFL4gr2OGGPq6tG4ZOX7tayurhDfF';
        const apiSecret = '33r8UF8KI38pmuN0';

        const response = await fetch(
          'https://test.api.amadeus.com/v1/security/oauth2/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
          }
        );

        const { access_token } = await response.json();

        const fetchFlightData = async (location) => {
          const response = await fetch(
            `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${location}&destinationLocationCode=${dest}&departureDate=${departureDate}&adults=${adults}&includedAirlineCodes=${airlines}`,
            {
              headers: {
                Authorization: 'Bearer ' + access_token,
              },
            }
          );
          const data = await response.json();
          if (!data.data || !data.data[0]) {
            throw new Error(`No flights found for ${cityNames[location]}.`);
          }

          return {
            total: parseFloat(data.data[0].price.total),
            flight: data.data[0],
            fullLocationName: cityNames[location],
          };
        };

        const location1Data = await fetchFlightData(location1);
        const location2Data = await fetchFlightData(location2);

        setFlights({ location1: location1Data, location2: location2Data });
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const getCityName = (code) => {
    return cityNames[code] || code;
  };

  const getAirlineName = (code) => {
    return airlineNames[code] || code;
  };

  if (!flights) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h4" component="div" gutterBottom align="center">
            Halfway between you and your friends...
          </Typography>
        </Box>

        {['location1', 'location2'].map((location) => (
          <Box key={location}>
            <Typography variant="h5" component="div" gutterBottom>
              From: {flights[location].fullLocationName}
            </Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography>
                Airline: {getAirlineName(flights[location].flight.validatingAirlineCodes)}
              </Typography>

              <Typography>
                Duration: {flights[location].flight.itineraries[0].duration}
              </Typography>

              <Typography>
                Price: ${flights[location].total.toFixed(2)}
              </Typography>
            </Paper>
          </Box>
        ))}

        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'success.light',
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Halfway is: {getCityName(destination)}
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Button variant="contained" color="primary">
              Total Cost: ${(flights.location1.total + flights.location2.total).toFixed(2)}
            </Button>

            <Button variant="contained" color="secondary">
              Cost if Split: ${((flights.location1.total + flights.location2.total) / 2).toFixed(2)}
            </Button>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default CheapestOnlyPage;
