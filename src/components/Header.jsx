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

function Header({  onCategoryChange, setSearchQuery }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfileMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const { cartCount, setCartCount } = useContext(CartContext);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  
  }, [setCartCount]);

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

  async function handleLogout() {
    await auth.signOut();
    window.location.href = "./login";
    console.log("logged out success");
  }

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
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/aboutus")}>
            <ListItemText primary="About Us" />
          </ListItem>
          {/* Add other drawer items here */}
        </List>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={openProfileMenu}
        onClose={handleProfileMenuClose}
      >
        {userDetails && (
          <>
            <MUI_MenuItem>
              <Typography variant="body1">
                {userDetails.name}
              </Typography>
            </MUI_MenuItem>
            <MUI_MenuItem>
              <Typography variant="body2" color="textSecondary">
                {userDetails.mobileNumber}
              </Typography>
            </MUI_MenuItem>
            <MUI_MenuItem onClick={handleLogout}>
              <Typography variant="body2" color="error">
                Logout
              </Typography>
            </MUI_MenuItem>
          </>
        )}
      </Menu>

      <div className="headerBottomContainer">
        <div className="headerBottom">
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/electronics")}
          >
            Electronics
          </Typography>
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/monitor")}
          >
            Monitors
          </Typography>
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/casual")}
          >
            Casual Wear
          </Typography>
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/jewellery")}
          >
            Jewellery
          </Typography>
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/men")}
          >
            Men Wear
          </Typography>
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/Bags")}
          >
            Bags
          </Typography>
          <Typography
            variant="body1"
            className="headerBottomText"
            onClick={() => navigate("/women")}
          >
            Women's Wear
          </Typography>
        </div>
      </div>
    </AppBar>
  );
}

export default Header;