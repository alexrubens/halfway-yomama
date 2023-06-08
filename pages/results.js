import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import cityNames from '../data/CityNames';
import airlineNames from '../data/AirlineNames';
import { Container, Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';

const theme = createTheme();

export default function Results() {
  const router = useRouter();

  const [cheapestFlights, setCheapestFlights] = useState({});
  const [searching, setSearching] = useState(true);
  const [cheapestDestination, setCheapestDestination] = useState('');
  const [cheapestDestinationCost, setCheapestDestinationCost] = useState(0);

  useEffect(() => {
    const { location1, location2, destinations = '', departureDate, adults } = router.query;
    const destinationList = destinations.split(',').map((destination) => destination.trim());

    fetch('/api/searchFlights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location1, location2, destinations: destinationList, departureDate, adults }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCheapestFlights(data.flightData);
        // Here, you should implement your own logic to find the cheapest flight and update the state accordingly.
        setSearching(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Head>
          <title>Results</title>
          <meta name="description" content="Results page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={2}>
            {Object.keys(cheapestFlights).map((location) => (
              <Grid item xs={6} key={location}>
                <Paper elevation={2}>
                  <Box p={2}>
                    <Typography variant="h6">
                      From{' '}
                      {cheapestFlights[location].flight &&
                        cityNames[cheapestFlights[location].flight.departure.iataCode]}{' '}
                      to{' '}
                      {cheapestFlights[location].flight &&
                        cityNames[cheapestFlights[location].flight.arrival.iataCode]}
                    </Typography>
                    <Typography variant="body1">
                      Date:{' '}
                      {cheapestFlights[location].flight &&
                        cheapestFlights[location].flight.itineraries &&
                        cheapestFlights[location].flight.itineraries[0] &&
                        cheapestFlights[location].flight.itineraries[0].segments[0].departure.at}
                    </Typography>
                    <Typography variant="body1">
                      Flight Number:{' '}
                      {cheapestFlights[location].flight &&
                        cheapestFlights[location].flight.itineraries &&
                        cheapestFlights[location].flight.itineraries[0] &&
                        cheapestFlights[location].flight.itineraries[0].segments[0].number}
                    </Typography>
                    <Typography variant="body1">
                      Airline:{' '}
                      {cheapestFlights[location].flight &&
                        cheapestFlights[location].flight.itineraries &&
                        cheapestFlights[location].flight.itineraries[0] &&
                        airlineNames[
                          cheapestFlights[location].flight.itineraries[0].segments[0].carrierCode
                        ]}
                    </Typography>
                    <Typography variant="body1">
                      Total Cost: ${cheapestFlights[location].cost.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      If split evenly: ${(
                        cheapestFlights[location].cost / Object.keys(cheapestFlights).length
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4 }} bgcolor="success.main" p={2}>
            <Typography variant="h5">Cheapest Destination: {cheapestDestination}</Typography>
            <Typography variant="h6">Total Cost: ${cheapestDestinationCost.toFixed(2)}</Typography>
            <Typography variant="h6">
              If split evenly: ${(
                cheapestDestinationCost / Object.keys(cheapestFlights).length
              ).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Link href="/">New Search</Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}