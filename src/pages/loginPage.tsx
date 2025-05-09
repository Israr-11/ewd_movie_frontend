import React from "react";
import LoginForm from "../components/loginForm";
import { Typography, Container } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        sx={{ my: 4, textAlign: "center" }}
      >
        Sign In to Your Account
      </Typography>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
