import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import './ProductItem.css';
import { CartContext } from './context/CartContext';
// import { auth,  } from '..components/Firebase'; // Firebase auth and Firestore
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Firestore methods
import { db, auth } from './Firebase';


function ProductItem({ item }) {
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);

  const handleAddToCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('You need to be logged in to add items to the cart.');
      return;
    }

    const userId = user.uid; // Use user's UID
    const cartRef = doc(db, 'cart', userId); // Reference to the cart collection
    const activityRef = doc(db, 'activityHistory', userId); 

    try {
      const cartDoc = await getDoc(cartRef);

      let cartItems = [];
      if (cartDoc.exists()) {
        cartItems = cartDoc.data().items || [];
      }

      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += 1; 
      } else {
        cartItems.push({ ...item, quantity: 1 }); 
      }
      await setDoc(cartRef, { items: cartItems });

      const activityDoc = await getDoc(activityRef);
      if (!activityDoc.exists()) {
        // If activity document doesn't exist, create it with the first activity
        await setDoc(activityRef, {
          activities: [
            {
              ...item,
              action: 'added to cart',
              timestamp: new Date().toLocaleString(), 
            },
          ],
        });
      } else {
        // If document exists, update the activity with arrayUnion
        await updateDoc(activityRef, {
          activities: arrayUnion({
            ...item,
            action: 'added to cart',
            timestamp: new Date().toLocaleString(),
          }),
        });
      }

      const newCartCount = cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
      updateCartCount(newCartCount);

      alert(`${item.title} added to your cart and activity history!`);
    } catch (error) {
      console.error('Error adding item to cart or activity:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // Handle Buy Now action
  const handleBuyNow = () => {
    navigate('/payment', { state: { cartItems: [{ ...item, quantity: 1 }] } });
  };

  // Handle View Details action
  const handleViewDetails = async () => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; 
      const activityRef = doc(db, 'activityHistory', userId);

      try {
        const activityDoc = await getDoc(activityRef);
        if (!activityDoc.exists()) {
          await setDoc(activityRef, {
            activities: [
              {
                ...item,
                action: 'viewed product details',
                timestamp: new Date().toLocaleString(),
              },
            ],
          });
        } else {
          await updateDoc(activityRef, {
            activities: arrayUnion({
              ...item,
              action: 'viewed product details',
              timestamp: new Date().toLocaleString(),
            }),
          });
        }
      } catch (error) {
        console.error('Error updating activity history:', error);
      }
    }

    navigate(`/productDetails/${item.id}`, { state: { product: item } });
  };

  return (
    <Card sx={{ width: 300, margin: 'auto' }} className="productItem">
      <CardActionArea onClick={handleViewDetails}>
        <CardMedia
          component="img"
          style={{
            width: '100%',
            height: 200,
            objectFit: 'contain',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          image={item.image}
          alt={item.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.title.length > 30 ? item.title.substr(0, 30) + '...' : item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {item.description.length > 60
              ? item.description.substr(0, 60) + '...'
              : item.description}
          </Typography>
          <Typography variant="h6" component="div" sx={{ mt: 2 }}>
            ₹{item.price.toFixed(2)}
          </Typography>

          {/* Display rating as stars */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Rating name="read-only" value={item.rating.rate} precision={0.1} readOnly />
            <Typography variant="body2" style={{ marginLeft: '8px' }}>
              ({item.rating.count} reviews)
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>

      {/* Action buttons */}
      <div className="product-actions" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          sx={{ marginRight: 1 }}
        >
          Add to Cart
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBuyNow}
          sx={{ marginRight: 1 }}
        >
          Buy Now
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}

export default ProductItem;