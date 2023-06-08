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
<<<<<<< HEAD
=======
import styles from '../styles/CheapestOnly.module.css';
import { Container, Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import { delay } from 'lodash';
>>>>>>> 299723b29cfe09ea3e733af556dd5677983abc39

const theme = createTheme();

function CheapestOnlyPage() {
<<<<<<< HEAD
  const [flights, setFlights] = useState(null);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState(null);
=======
  const router = useRouter();
  const { location1, location2, destinations = '', departureDate, adults, airlines } = router.query;

  const destinationList = destinations && destinations.trim().length > 0 
    ? destinations.split(',').map((destination) => destination.trim()) 
    : Object.keys(cityNames);

  const [flights, setFlights] = useState({});
  const [cheapestFlights, setCheapestFlights] = useState({});
  const [searchProgress, setSearchProgress] = useState(0);
  const [error, setError] = useState(null);
>>>>>>> 299723b29cfe09ea3e733af556dd5677983abc39

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

<<<<<<< HEAD
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
=======
      const fetchData = async () => {
        try {
          const tokenResponse = await fetch(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
>>>>>>> 299723b29cfe09ea3e733af556dd5677983abc39
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
            }
          );
<<<<<<< HEAD
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
=======
          const { access_token } = await tokenResponse.json();

          let completedSearches = 0;

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

            await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay


            const response2 = await fetch(
              `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${location2}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`,
              {
                headers: {
                  Authorization: 'Bearer ' + access_token,
                },
              }
            );
            const data2 = await response2.json();

            await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay

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

            completedSearches++;
            setSearchProgress((completedSearches / destinationList.length) * 100);
          }

          const cheapestDestination = Object.entries(flightData).reduce(
            (cheapest, [destination, flightInfos]) => {
              const totalCost =
                flightInfos.location1.total + flightInfos.location2.total;

              if (!cheapest || totalCost < cheapest.totalCost) {
                return {
                  destination,
                  totalCost,
                  location1: flightInfos.location1,
                  location2: flightInfos.location2,
                };
              } else {
                return cheapest;
              }
            },
            null
          );

          setFlights(flightData);
          setCheapestFlights(cheapestDestination);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchData();
    }
  }, [location1, location2, departureDate, adults, destinationList]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            {searchProgress < 100 ? `Search Progress: ${searchProgress.toFixed(2)}%` : 'Your Results'}
          </Typography>
          {error && <Typography color="error">Error: {error}</Typography>}
          {cheapestFlights && cheapestFlights.location1 && cheapestFlights.location2 ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Cheapest Destination: {cityNames[cheapestFlights.destination]}
                  </Typography>
                  <Typography variant="h6">
                    Total Cost: ${cheapestFlights.totalCost.toFixed(2)}
                  </Typography>
                  <Typography variant="h6">
                    Flight Details:
                  </Typography>
                  {['location1', 'location2'].map(location => (
                    <div key={location}>
                      <Typography variant="h6">
                        From {cityNames[cheapestFlights[location].flight.departure.iataCode]} to {cityNames[cheapestFlights[location].flight.arrival.iataCode]}
                      </Typography>
                      <Typography variant="body1">
                        Date: {cheapestFlights[location].flight.departure.at}
                      </Typography>
                      <Typography variant="body1">
                        Flight Number: {cheapestFlights[location].flight.carrierCode}{cheapestFlights[location].flight.number}
                      </Typography>
                      <Typography variant="body1">
                        Total Cost: ${cheapestFlights[location].total.toFixed(2)}
                      </Typography>
                      <Typography variant="body1">
                        Airline: {airlineNames[cheapestFlights[location].flight.carrierCode]}
                      </Typography>
                    </div>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <CircularProgress />
          )}
        </Box>
>>>>>>> 299723b29cfe09ea3e733af556dd5677983abc39
      </Container>
    </ThemeProvider>
  );
}

export default CheapestOnlyPage;
