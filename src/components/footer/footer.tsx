import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const FooterContainer = styled(Box)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  padding: "1rem 0",
  borderTop: "1px solid #333333",
  position: "fixed",
  bottom: 0,
  left: "0.47%",
  width: "99.03%",
  zIndex: 100,
});

const FooterContent = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: "95%",
});

const Copyright = styled(Typography)({
  color: "#CCCCCC",
  fontSize: "0.9rem",
  textAlign: "center",
});

const AccentText = styled("span")({
  color: "#E50914",
  fontWeight: "bold",
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
