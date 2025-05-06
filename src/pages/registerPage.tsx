import React from 'react';
import RegisterForm from '../components/registerForm';
import { Typography, Container } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" sx={{ my: 4, textAlign: 'center' }}>
        Create an Account
      </Typography>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
