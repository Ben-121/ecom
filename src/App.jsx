import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from './screens/Home';
import Cart from "./screens/Cart";
import Payment from "./screens/Payment";
import ProductDetails from "./screens/ProductDetails";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Header from "./components/Header";
import Body from "./components/Body";
import Men from "./screens/path/Men";
import Women from "./screens/path/Women";
import Casual from "./screens/path/Casual";
import Jewellery from "./screens/path/Jewellery";
import Electronics from "./screens/path/Electronics";
import Monitors from "./screens/path/Monitors";
import Bags from "./screens/path/Bags";
import AboutUs from "./screens/Aboutus";
import ActivityHistory from "./screens/ActivityHistory";
import { CartProvider } from "./components/context/CartContext";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Component to conditionally render Header
  const ConditionalHeader = () => {
    const location = useLocation();
    const showHeader = !["/login", "/signup"].includes(location.pathname);
    return showHeader ? (
      <Header 
        onCategoryChange={handleCategoryChange} 
        setSearchQuery={setSearchQuery} 
      />
    ) : null;
  };

  return (
    <CartProvider>
      <Router>
        <ConditionalHeader />
        <Routes>
          <Route 
            path='/' 
            element={
              <>
                <Home category={selectedCategory} />
                <Body category={selectedCategory} searchQuery={searchQuery} />
              </>
            } 
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/casual" element={<Casual />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/monitor" element={<Monitors />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/bags" element={<Bags />} />
          <Route path="/activityhistory" element={<ActivityHistory />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/productDetails/:productDetailsId" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
