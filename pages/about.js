import React from 'react';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography } from '@mui/material';

const About = () => (
  <React.Fragment>
    <CssBaseline />
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Halfway
        </Typography>
        <Typography component="h2" variant="body1">
          A brief description about our app and its functionality.
        </Typography>
        <Typography component="h2" variant="body2">
          Here is some more information about us.
        </Typography>
      </Box>
    </Container>
  </React.Fragment>
);

export default About;
