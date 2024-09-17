import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Rating,
  IconButton,
} from "@mui/material";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../components/firebase"; // Make sure Firebase auth is imported
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Seller() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ratingRate, setRatingRate] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user ID
    const fetchUserId = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
        fetchProducts(currentUser.uid);
      } else {
        setError("User not authenticated");
      }
    };
    fetchUserId();
  }, []);

  const fetchProducts = async (userId) => {
    try {
      // Query products added by the current user (seller)
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("sellerId", "==", userId)); // Only get products for the current seller
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid price.");
      setLoading(false);
      return;
    }

    if (!title || !description || !imageUrl || ratingRate === null || ratingCount === null || !category) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    const productData = {
      title,
      description,
      image: imageUrl,
      price: priceValue,
      rating: {
        rate: ratingRate,
        count: ratingCount,
      },
      category,
      sellerId: userId, // Store seller's ID in the product document
      createdAt: new Date(),
    };

    try {
      if (editProductId) {
        // Update existing product
        const productRef = doc(db, "products", editProductId);
        await updateDoc(productRef, productData);
        alert("Product updated successfully!");
        setEditProductId(null);
      } else {
        // Add new product
        await addDoc(collection(db, "products"), productData);
        alert("Product added successfully!");
      }

      setLoading(false);
      resetForm();
      fetchProducts(userId); // Refresh the product list
    } catch (error) {
      setError("Error saving product: " + error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setRatingRate(0);
    setRatingCount(0);
    setPrice("");
    setCategory("");
    setEditProductId(null);
  };

  const handleEdit = (product) => {
    setTitle(product.title);
    setDescription(product.description);
    setImageUrl(product.image);
    setRatingRate(product.rating.rate);
    setRatingCount(product.rating.count);
    setPrice(product.price);
    setCategory(product.category);
    setEditProductId(product.id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter((product) => product.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {editProductId ? "Edit Product" : "Add New Product"}
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Product Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div style={{ margin: "20px 0" }}>
          <Typography gutterBottom>Product Rating</Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Rating
              name="ratingRate"
              value={ratingRate}
              onChange={(event, newValue) => setRatingRate(newValue)}
              precision={0.1}
            />
            <TextField
              label="Rating Count"
              variant="outlined"
              type="number"
              value={ratingCount}
              onChange={(e) => setRatingCount(parseInt(e.target.value, 10) || 0)}
              style={{ marginLeft: "10px", width: "120px" }}
            />
          </div>
        </div>

        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <FormControl
          variant="outlined"
          style={{ width: "100%", margin: "20px 0" }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="jewelery">Jewelry</MenuItem>
            <MenuItem value="men's clothing">Men's Clothing</MenuItem>
            <MenuItem value="women's clothing">Women's Clothing</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : editProductId ? "Update Product" : "Add Product"}
        </Button>
      </form>

      <Typography variant="h5" gutterBottom style={{ marginTop: "40px" }}>
        Product List
      </Typography>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <div>
            <Typography variant="h6">{product.title}</Typography>
            <Typography variant="body2">{product.description}</Typography>
            <Typography variant="body2">
              Price: ${product.price} | Rating: {product.rating.rate} ({product.rating.count} reviews)
            </Typography>
            <Typography variant="body2">Category: {product.category}</Typography>
          </div>
          <div>
            <IconButton onClick={() => handleEdit(product)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(product.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Seller;
