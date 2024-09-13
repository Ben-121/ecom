  import React, { useEffect, useState, useMemo } from "react";
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

    // Filter and sort products
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
        return sortProductsByPrice(productsToSort, priceSortOrder);
      } else if (rateSortOrder) {
        return sortProductsByRate(productsToSort, rateSortOrder);
      }
      return productsToSort;
    }, [filteredProducts, priceSortOrder, rateSortOrder]);

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
              <div className="loading-container">

          <CircularProgress/>
          </div>
        ) : error ? (
          <>
            <Typography color="error">Failed to load products. Please try again later.</Typography>
            <Typography color="textSecondary">{error}</Typography>
          </>
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
