import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  InputBase,
  Box,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";
import { CartContext } from "./context/CartContext";
import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function Header({ onCategoryChange, setSearchQuery }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "Guest",
    mobileNumber: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for debouncing
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  // Fetch user data from Firebase
  const fetchUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserDetails({
        name: data.firstName || "Guest",
        mobileNumber: data.mobileNumber || "",
      });
      localStorage.setItem("userDetails", JSON.stringify(data));
    }
  };

  useEffect(() => {
    const localUserData = localStorage.getItem("userDetails");
    if (localUserData) {
      const parsedData = JSON.parse(localUserData);
      setUserDetails({
        name: parsedData.firstName || "Guest",
        mobileNumber: parsedData.mobileNumber || "",
      });
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserDetails({
          name: "Guest",
          mobileNumber: "",
        });
        localStorage.removeItem("userDetails");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); 
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchQuery(searchTerm); 
    }, 500); 

    return () => clearTimeout(debounce); 
  }, [searchTerm, setSearchQuery]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
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

  const handleLogin = () => {
    window.location.replace("/login");
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userDetails");
      window.location.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate("/", { replace: true })}
          >
            <img src={logo} alt="logo" style={{ width: 40 }} />
          </IconButton>
          {window.location.pathname === "/" && (
            <>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="jewelery">Jewelry</MenuItem>
                  <MenuItem value="men's clothing">Men's Clothing</MenuItem>
                  <MenuItem value="women's clothing">Women's Clothing</MenuItem>
                </Select>
              </FormControl>

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearchChange}
                />
              </Search>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" onClick={() => navigate("/activityhistory")}>
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
        </Toolbar>
      </AppBar>

      {/* Drawer and Menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {userDetails.name !== "Guest" && (
            <ListItem button onClick={() => navigate("/profile")}>
              <ListItemText primary="Profile" />
            </ListItem>
          )}
         {userDetails.isSeller === false &&
         ( <ListItem button onClick={() => navigate("/orders")}>
            <ListItemText primary="Recent Orders" />
          </ListItem>)}
        </List>
      </Drawer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
        <MenuItem>
          <Typography>{userDetails.name}</Typography>
        </MenuItem>
        {userDetails.name === "Guest" ? (
          <MenuItem onClick={handleLogin}>Login</MenuItem>
        ) : (
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export default Header;
