import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { CartContext } from '../components/context/CartContext';
// import { auth, db } from '../components/Firebase'; // Import Firebase
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Firestore methods
import { db, auth } from '../components/firebase';


function Cart() {
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items based on user UID from Firestore
  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid; // Get user UID
        const cartRef = doc(db, 'cart', userId); // Reference to user's cart in Firestore
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items || []);
        } else {
          setCartItems([]);
        }

        const newCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        updateCartCount(newCartCount);
      } else {
        setCartItems([]);
      }

      setLoading(false);
    };

    fetchCartItems();
  }, [updateCartCount, cartItems]);

  // Add timestamp and save action to Firestore in the 'activity' collection
  const logActivity = async (action, item) => {
    const userId = auth.currentUser?.uid; // Get user UID
    const timestamp = new Date().toLocaleString(); // Get current timestamp

    if (userId) {
      const activityRef = doc(db, 'activityHistory', userId); // Reference to the user's activity document in Firestore

      // Initialize activity document if it doesn't exist
      const activityDoc = await getDoc(activityRef);
      if (!activityDoc.exists()) {
        await setDoc(activityRef, { activities: [] });
      }

      // Add activity to the Firestore activity collection with timestamp
      await updateDoc(activityRef, {
        activities: arrayUnion({
          ...item,
          action,
          timestamp, // Store the timestamp of the action
        }),
      });
    }
  };

  // Add item to cart and log it in both 'cart' and 'activity' collections
  const handleAddToCart = async (item) => {
    const userId = auth.currentUser?.uid; // Get user UID
    const cartRef = doc(db, 'cart', userId); // Reference to user's cart in Firestore

    // Fetch existing cart items
    const cartDoc = await getDoc(cartRef);
    let cartItems = [];
    if (cartDoc.exists()) {
      cartItems = cartDoc.data().items || [];
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }

    // Save the updated cart to Firestore
    await setDoc(cartRef, { items: cartItems });

    // Log the "added to cart" action in the activity collection
    await logActivity('added to cart', item);

    // Update the cart count in the context
    const newCartCount = cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
    updateCartCount(newCartCount);
  };

  // Remove item from the cart and log it to the activity collection
  const handleRemove = async (index) => {
    const removedItem = cartItems[index];
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);

    const userId = auth.currentUser?.uid;
    const cartRef = doc(db, 'cart', userId);

    // Update the cart in Firestore
    await setDoc(cartRef, { items: updatedCartItems });

    // Log the "removed from cart" action in the activity collection
    await logActivity('removed from cart', removedItem);
  };

  // Increase item quantity in the cart and log it to the activity collection
  const handleAdd = async (index) => {
    const updatedCartItems = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);

    const userId = auth.currentUser?.uid;
    const cartRef = doc(db, 'cart', userId);

    // Update the cart in Firestore
    await setDoc(cartRef, { items: updatedCartItems });

    // Log the "increased quantity" action in the activity collection
    await logActivity('increased quantity', updatedCartItems[index]);
  };

  // Decrease item quantity in the cart and log it to the activity collection
  const handleSubtract = async (index) => {
    const updatedCartItems = cartItems.map((item, i) =>
      i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCartItems);

    const userId = auth.currentUser?.uid;
    const cartRef = doc(db, 'cart', userId);

    // Update the cart in Firestore
    await setDoc(cartRef, { items: updatedCartItems });

    // Log the "decreased quantity" action in the activity collection
    await logActivity('decreased quantity', updatedCartItems[index]);
  };

  // Navigate to the payment page with cart data
  const handleBuyNow = () => {
    navigate('/payment', { state: { cartItems } });
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Loading cart items...</p>
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