import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)({
  backgroundColor: '#0D0D0D',
  color: '#FFFFFF',
  padding: '1rem 0',
  borderTop: '1px solid #333333',
  position: 'fixed', // Keep it fixed at the bottom
  bottom: 0,
  left: '0.47%', // Match the header's left position
  width: '99.03%', // Match the header's width
  zIndex: 100,
});

const FooterContent = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '95%', // Further constrain the content if needed
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
