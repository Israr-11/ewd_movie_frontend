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

  // Create menu items for authentication
  const authMenuItems = isAuthenticated 
    ? [<MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>]
    : [
        <MenuItem key="login" onClick={() => handleMenuSelect("/login")}>Login</MenuItem>,
        <MenuItem key="register" onClick={() => handleMenuSelect("/register")}>Register</MenuItem>
      ];

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Menu
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
                {/* Combine all menu items into a single array */}
                {[
                  ...allOptions.map((opt) => (
                    <MenuItem
                      key={opt.label}
                      onClick={() => handleMenuSelect(opt.path)}
                    >
                      {opt.label}
                    </MenuItem>
                  )),
                  ...authMenuItems
                ]}
              </Menu>
            </>
          ) : (
            <>
              {allOptions.map((opt) => (
                <Button
                  key={opt.label}
                  color="inherit"
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </Button>
              ))}
              {isAuthenticated ? (
                <>
                  <Typography variant="body1" sx={{ mx: 2 }}>
                    {userEmail}
                  </Typography>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => handleMenuSelect("/login")}>
                    Login
                  </Button>
                  <Button color="inherit" onClick={() => handleMenuSelect("/register")}>
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
