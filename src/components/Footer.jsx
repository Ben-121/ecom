import React from 'react';
import { Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <Divider />
      <Container maxWidth="lg">
        <Grid container spacing={3} className="footerContent">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              123 Main Street, City, Country
            </Typography>
            <Typography variant="body2">
              Phone: +123 456 7890
            </Typography>
            <Typography variant="body2">
              Email: <Link href="mailto:info@example.com">info@example.com</Link>
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <ul className="footerLinks">
              <li><Link href="/aboutus">About Us</Link></li>
              <li><Link href="/">Contact Us</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <div className="socialMediaIcons">
              <IconButton color="inherit" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedIn />
              </IconButton>
            </div>
          </Grid>
        </Grid>

        <Divider style={{ marginTop: '20px' }} />
        <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;
