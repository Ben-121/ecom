import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to our application! We are dedicated to providing you with the best service possible.
          Our team is passionate about delivering high-quality solutions to meet your needs. Our
          mission is to make your experience seamless and enjoyable.
        </Typography>
        <Typography variant="body1" paragraph>
          Our team consists of experts from various fields, including technology, design, and customer
          support. We work together to ensure that every aspect of our application is tailored to
          deliver exceptional value to you.
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for choosing us. We look forward to serving you and making your experience a
          memorable one. If you have any questions or feedback, feel free to reach out to us at
          support@example.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
