import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)({
  backgroundColor: '#0D0D0D',
  color: '#FFFFFF',
  padding: '1rem 0',
  borderTop: '1px solid #333333',
  position: 'fixed', // Fix the footer at the bottom
  bottom: 0, // Position at bottom
  left: 0, // Stretch across the full width
  right: 0,
  width: '100%',
  zIndex: 100, // Ensure it stays above other content
});

const FooterContent = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Copyright = styled(Typography)({
  color: '#CCCCCC',
  fontSize: '0.9rem',
  textAlign: 'center',
});

const AccentText = styled('span')({
  color: '#E50914',
  fontWeight: 'bold',
});

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent maxWidth="lg">
        <Copyright>
          &copy; 2025 <AccentText>Movie</AccentText>Fest. All Rights Reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
