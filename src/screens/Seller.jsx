import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Typography, Button, CircularProgress, TextField, Rating } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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

    try {
      const productData = {
        title,
        description,
        image: imageUrl,
        price: priceValue, 
        rating: {
          rate: ratingRate,
          count: ratingCount
        },
        category, 
        createdAt: new Date(),
      };

      await addDoc(collection(db, "products"), productData);

      setLoading(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setRatingRate(0);
      setRatingCount(0); 
      setPrice(""); 
      setCategory(""); 
      alert("Product added successfully!");

      navigate("/seller");

    } catch (error) {
      setError("Error adding product: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
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
              style={{ marginLeft: '10px', width: '120px' }}
            />
          </div>
        </div>

        <div style={{ margin: "20px 0" }}>
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          step="0.01" // Allows for decimal values
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
            style={{
              border: "2px solid #333",
              borderRadius: "4px",
            }}
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
          {loading ? <CircularProgress size={24} /> : "Add Product"}
        </Button>
      </form>
    </div>
  );
}

export default Seller;
