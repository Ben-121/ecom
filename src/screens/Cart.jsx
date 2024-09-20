import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { CartContext } from '../components/context/CartContext';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db, auth } from '../components/Firebase';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, setCartItems, cartCount, updateCartCount } = useContext(CartContext); // Use CartContext
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const cartRef = doc(db, 'cart', userId);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          const fetchedCartItems = cartDoc.data().items || [];
          setCartItems(fetchedCartItems);

          const newCartCount = fetchedCartItems.reduce((acc, item) => acc + item.quantity, 0);
          updateCartCount(newCartCount); // Update cart count
        } else {
          setCartItems([]); // If no cart items exist, empty the cart
          updateCartCount(0); // Reset cart count
        }
      } else {
        setCartItems([]); // If no user is logged in, reset cart
        updateCartCount(0); // Reset cart count
      }

      setLoading(false);
    };

    fetchCartItems(); // Fetch cart items on mount

  }, [setCartItems, updateCartCount]);

  const handleRemove = async (index) => {
    const removedItem = cartItems[index];
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);

    const userId = auth.currentUser?.uid;
    const cartRef = doc(db, 'cart', userId);

    await setDoc(cartRef, { items: updatedCartItems });

    const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    updateCartCount(newCartCount); // Update cart count after removal
  };

  const handleAdd = async (index) => {
    const updatedCartItems = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);

    const userId = auth.currentUser?.uid;
    const cartRef = doc(db, 'cart', userId);

    await setDoc(cartRef, { items: updatedCartItems });

    const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    updateCartCount(newCartCount); // Update cart count after addition
  };

  const handleSubtract = async (index) => {
    const updatedCartItems = cartItems.map((item, i) =>
      i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCartItems);

    const userId = auth.currentUser?.uid;
    const cartRef = doc(db, 'cart', userId);

    await setDoc(cartRef, { items: updatedCartItems });

    const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    updateCartCount(newCartCount); // Update cart count after subtraction
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
