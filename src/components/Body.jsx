import React, { useEffect, useState, useMemo } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ProductItem from "./ProductItem";
import "./Body.css";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom";

function Body({ category, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceSortOrder, setPriceSortOrder] = useState(null);
  const [rateSortOrder, setRateSortOrder] = useState(null);
  const [isSeller, setIsSeller] = useState(false); // State to track if the user is a seller

  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProductsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsFromFirestore();
  }, []);

  // Fetch user data using getDoc() when the component mounts to check if the user is a seller
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.isSeller) {
              setIsSeller(true); // Set the state if the user is a seller
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    // Check if user is logged in before trying to fetch details
    if (auth.currentUser) {
      fetchUserDetails();
    } else {
      const checkuser = setInterval(() => {
        if (auth.currentUser) {
          fetchUserDetails();
          clearInterval(checkuser); // Stop checking once the user is found
        }
      }, 100); // Check every 100ms until the user is loaded
    }
  }, []);

  // Sorting logic (memoized)
  const sortProducts = (products, sortOrder, sortKey) => {
    if (!sortOrder) return products;
    return [...products].sort((a, b) =>
      sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesSearchQuery = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearchQuery;
    });
  }, [products, category, searchQuery]);

  const sortedProducts = useMemo(() => {
    let productsToSort = [...filteredProducts];
    if (priceSortOrder) {
      return sortProducts(productsToSort, priceSortOrder, "price");
    } else if (rateSortOrder) {
      return sortProducts(productsToSort, rateSortOrder, "rating.rate");
    }
    return productsToSort;
  }, [filteredProducts, priceSortOrder, rateSortOrder]);

  const handlePriceSortChange = () => {
    setPriceSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setRateSortOrder(null); // Reset rating sort order when changing price sort
  };

  const handleRateSortChange = () => {
    setRateSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setPriceSortOrder(null); // Reset price sort order when changing rating sort
  };

  return (
    <div className="body">
      {/* Sorting Controls and Add Product Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, paddingRight: 2, marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePriceSortChange}
          startIcon={priceSortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
          sx={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#115293",
            },
            marginTop: "6px",
          }}
        >
          Sort by Price ({priceSortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRateSortChange}
          startIcon={rateSortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
          sx={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#115293",
            },
            marginTop: "6px",
          }}
        >
          Sort by Rating ({rateSortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>
        {/* Seller Button */}
        {isSeller && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/seller")} // Navigate to the Seller page
            sx={{
              backgroundColor: "#f50057",
              "&:hover": {
                backgroundColor: "#c51162",
              },
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              marginTop: "6px",
            }}
          >
            Add Product
          </Button>
        )}
      </Box>

      {/* Product Listing */}
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : error ? (
        <>
          <Typography color="error">Failed to load products. Please try again later.</Typography>
          <Typography color="textSecondary">{error}</Typography>
        </>
      ) : (
        <div className="bodyItems">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((item) => <ProductItem item={item} key={item.id} />)
          ) : (
            <Typography>No products found</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default Body;
