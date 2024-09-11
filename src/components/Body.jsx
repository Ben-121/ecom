import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ProductItem from "./ProductItem";
import "./Body.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";


function Body({ category, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceSortOrder, setPriceSortOrder] = useState(null);
  const [rateSortOrder, setRateSortOrder] = useState(null);

  useEffect(() => {
    const fetchProductsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsFromFirestore();
  }, []);

  const sortProductsByPrice = (products, order) => {
    return products.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
  };

  const sortProductsByRate = (products, order) => {
    return products.sort((a, b) => order === 'asc' ? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate);
  };

  // Filter products based on category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category ? product.category === category : true;
    const matchesSearchQuery = searchQuery
      ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearchQuery;
  });

  // Apply sorting to filtered products
  let sortedProducts = [...filteredProducts];
  if (priceSortOrder) {
    sortedProducts = sortProductsByPrice(sortedProducts, priceSortOrder);
  } else if (rateSortOrder) {
    sortedProducts = sortProductsByRate(sortedProducts, rateSortOrder);
  }

  const handlePriceSortChange = () => {
    setPriceSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setRateSortOrder(null); // Reset rating sort order when changing price sort
  };

  const handleRateSortChange = () => {
    setRateSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setPriceSortOrder(null); // Reset price sort order when changing rating sort
  };

  return (
    <div className="body">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, paddingRight: 20 }}>
        <Button
          variant="contained" 
          color="primary" 
          onClick={handlePriceSortChange}
          startIcon={priceSortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
          sx={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            '&:hover': {
              backgroundColor: '#115293',
            },
            marginRight: '10px'
          }}
        >
          Sort by Price ({priceSortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRateSortChange}
          startIcon={rateSortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
          sx={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          Sort by Rating ({rateSortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <div className="bodyItems">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((item) => (
              <ProductItem item={item} key={item.id} />
            ))
          ) : (
            <Typography>No products found</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default Body;