import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem as MUI_MenuItem,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";
import "./Header.css";
import { CartContext } from "./context/CartContext";

function Header({ onCategoryChange, setSearchQuery }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "Guest",
    mobileNumber: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfileMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const fetchUserData = async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserDetails({
          name: data.firstName || "Guest",
          mobileNumber: data.mobileNumber || "",
        });
      }
    } else {
      setUserDetails({ name: "Guest", mobileNumber: "" });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      await fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigate = (path) => {
    navigate(path, { replace: true });
    setDrawerOpen(false);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Logged out successfully");
      window.location.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = () => {
    window.location.replace("/login");
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar className="toolbar">
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate("/", { replace: true })}
        >
          <img src={logo} alt="logo" className="logo" />
        </IconButton>

        <div className="headerInputContainer">
          <FormControl
            variant="outlined"
            className="categorySelect"
            style={{ width: "140px", marginRight: "8px" }}
          >
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
              style={{
                border: "2px solid #333",
                borderRadius: "4px",
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="jewelery">Jewelry</MenuItem>
              <MenuItem value="men's clothing">Men's Clothing</MenuItem>
              <MenuItem value="women's clothing">Women's Clothing</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            placeholder="Search Products"
            onChange={handleSearchChange}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              width: 400,
            }}
            size="small"
          />
        </div>

        <div className="headerActions">
          <IconButton
            color="inherit"
            onClick={() => navigate("/activityhistory")}
          >
            <HistoryIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <PersonIcon />
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </div>
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="drawerContainer">
          <List>
            {userDetails.name !== "Guest" && (
              <ListItem button onClick={() => handleNavigate("/profile")}>
                <ListItemText primary="Profile" />
              </ListItem>
            )}
            <ListItem button onClick={() => handleNavigate("/orders")}>
              <ListItemText primary="Recent Orders" />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={openProfileMenu}
        onClose={handleProfileMenuClose}
      >
        {userDetails && (
          <>
            <MUI_MenuItem>
              <Typography variant="body1">{userDetails.name}</Typography>
            </MUI_MenuItem>
            {userDetails.name !== "Guest" && (
              <MUI_MenuItem>
                <Typography variant="body2">
                  {userDetails.mobileNumber}
                </Typography>
              </MUI_MenuItem>
            )}
            {userDetails.name === "Guest" && (
              <MUI_MenuItem onClick={handleLogin} style={{ color: "red" }}>
                <Typography variant="body2">Login</Typography>
              </MUI_MenuItem>
            )}
            {userDetails.name !== "Guest" && (
              <MUI_MenuItem onClick={handleLogout}>
                <Typography variant="body2" color="error">
                  Logout
                </Typography>
              </MUI_MenuItem>
            )}
          </>
        )}
      </Menu>
    </AppBar>
  );
}

export default Header;
