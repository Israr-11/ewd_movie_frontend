import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../contexts/authContext";

// Update only the StyledAppBar and StyledToolbar components to adjust height and alignment
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#0D0D0D",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  borderBottom: "1px solid #333333",
  left: "0.47%",
  width: "99.03%",
  height: "8%", // Decreased from 10% to 8%
}));

const StyledToolbar = styled(Toolbar)({
  padding: "0rem", // Reduced padding
  minHeight: "56px", // Set a smaller minimum height
  display: "flex",
  alignItems: "center", // Ensure vertical centering
});

// Also update the SiteLogo to ensure it aligns well with the reduced height
const SiteLogo = styled(Typography)({
  flexGrow: 1,
  color: "#FFFFFF",
  fontWeight: "bold",
  marginLeft: "20px",
  letterSpacing: "1px",
  textShadow: "0 0 10px rgba(229, 9, 20, 0.5)",
  fontSize: "1.5rem", // Slightly smaller font size
  "& span": {
    color: "#E50914",
  }
});



const NavButton = styled(Button)({
  color: "#FFFFFF",
  margin: "0 4px",
  padding: "6px 12px",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    color: "#E50914",
  },
  transition: "all 0.3s ease",
  textTransform: "none",
  fontSize: "1rem",
});

const AuthButton = styled(Button)({
  color: "#FFFFFF",
  margin: "0 4px",
  padding: "6px 16px",
  border: "1px solid #E50914",
  "&:hover": {
    backgroundColor: "#E50914",
    borderColor: "#E50914",
  },
  transition: "all 0.3s ease",
  textTransform: "none",
  fontSize: "1rem",
});

const UserEmail = styled(Typography)({
  color: "#CCCCCC",
  margin: "0 12px",
  fontSize: "0.9rem",
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    backgroundColor: "#0D0D0D",
    color: "#FFFFFF",
    border: "1px solid #333333",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  },
});

const StyledMenuItem = styled(MenuItem)({
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    color: "#E50914",
  },
});

const MenuButton = styled(IconButton)({
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
  },
});

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { isAuthenticated, logout, userEmail } = useAuth();

  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "Actors", path: "/actors" },
    { label: "TV Series", path: "/tv" },
  ];

  const authenticatedOptions = [
    { label: "Favorites", path: "/movies/favourites" },
    { label: "Playlists", path: "/movies/playlists" },
    { label: "Fantasy Movies", path: "/fantasy-movies" },
  ];

  const allOptions = isAuthenticated 
    ? [...menuOptions, ...authenticatedOptions] 
    : menuOptions;

  const handleMenuSelect = (pageURL: string) => {
    navigate(pageURL);
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <SiteLogo variant="h4">
            Movie <span>Fest</span>
          </SiteLogo>
          {isMobile ? (
            <>
              <MenuButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                size="large"
              >
                <MenuIcon />
              </MenuButton>
              <StyledMenu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {allOptions.map((opt) => (
                  <StyledMenuItem
                    key={opt.label}
                    onClick={() => handleMenuSelect(opt.path)}
                  >
                    {opt.label}
                  </StyledMenuItem>
                ))}
                {isAuthenticated ? (
                  <StyledMenuItem onClick={handleLogout}>Logout</StyledMenuItem>
                ) : (
                  <>
                    <StyledMenuItem onClick={() => handleMenuSelect("/login")}>Login</StyledMenuItem>
                    <StyledMenuItem onClick={() => handleMenuSelect("/register")}>Register</StyledMenuItem>
                  </>
                )}
              </StyledMenu>
            </>
          ) : (
            <>
              {allOptions.map((opt) => (
                <NavButton
                  key={opt.label}
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </NavButton>
              ))}
              {isAuthenticated ? (
                <>
                  <UserEmail variant="body1">
                    {userEmail}
                  </UserEmail>
                  <AuthButton onClick={handleLogout}>
                    Logout
                  </AuthButton>
                </>
              ) : (
                <>
                  <AuthButton onClick={() => handleMenuSelect("/login")}>
                    Login
                  </AuthButton>
                  <AuthButton onClick={() => handleMenuSelect("/register")}>
                    Register
                  </AuthButton>
                </>
              )}
            </>
          )}
        </StyledToolbar>
      </StyledAppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
