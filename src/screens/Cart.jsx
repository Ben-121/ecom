import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { auth } from '../components/Firebase'; // Import Firebase auth
import {
  fetchCartItems,
  setCartItems,
  updateQuantity,
  removeFromCart,
  syncCartWithFirebase,
} from '../components/context/CartSlice';

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((state) => state.cart); // Removed cartCount since it's not used

  useEffect(() => {
    const checkUserAndFetchCart = () => {
      const user = auth.currentUser;
      if (user) {
        dispatch(fetchCartItems());
      } else {
        dispatch(setCartItems([])); // Ensure the cart is empty if no user is logged in
      }
    };

    checkUserAndFetchCart();
  }, [dispatch]);

  const handleRemove = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    dispatch(setCartItems(updatedCartItems));
    dispatch(syncCartWithFirebase(updatedCartItems));
  };

  const handleAdd = (index) => {
    const updatedQuantity = cartItems[index].quantity + 1;
    dispatch(updateQuantity({ index, quantity: updatedQuantity }));
    dispatch(syncCartWithFirebase(cartItems));
  };

  const handleSubtract = (index) => {
    const updatedQuantity = cartItems[index].quantity > 1 ? cartItems[index].quantity - 1 : 1;
    dispatch(updateQuantity({ index, quantity: updatedQuantity }));
    dispatch(syncCartWithFirebase(cartItems));
  };

  const handleBuyNow = () => {
    navigate('/payment', { state: { cartItems } });
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading cart items...</p>
        </div>
      ) : cartItems.length > 0 ? (
        cartItems.map((cartItem, index) => (
          <div key={index} className="cart-item">
            <img src={cartItem.image} alt={cartItem.title} style={{ width: 100, height: 100 }} />
            <div className="cart-item-details">
              <h3>{cartItem.title}</h3>
              <p>{cartItem.description}</p>
              <p>Price: ₹{cartItem.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => handleSubtract(index)}>-</button>
                <span>{cartItem.quantity}</span>
                <button onClick={() => handleAdd(index)}>+</button>
              </div>
              <p>Total: ₹{(cartItem.price * cartItem.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemove(index)}>Remove</button>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
      {cartItems.length > 0 && (
        <div className="buy-now-container">
          <button onClick={handleBuyNow} className="buy-now-button">
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
