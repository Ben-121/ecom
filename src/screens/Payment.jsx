import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../components/Firebase'; // Assuming you have Firebase authentication and Firestore setup here
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve cartItems from location.state
  const cartItems = location.state?.cartItems || [];

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // States for user details
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userId, setUserId] = useState('');

  // Fetch user details from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid); // Store the user's UID
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName + " " + userData.lastName);
          setUserPhone(userData.mobileNumber);
          setUserAddress(userData.address || "No address available");
        }
      }
    };
    fetchUserDetails();
  }, []);

  // Generate a unique 6-digit order ID
  const generateOrderId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
  };

  const storeOrderDetails = async (paymentId, orderId) => {
    try {
      const orderData = {
        orderId,
        paymentId,
        cartItems,
        totalAmount,
        userName,
        userPhone,
        userAddress,
        userId, // Store the userId (UID) for each order
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);
      alert("Order placed successfully!");

      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error storing order details: ", error);
      alert("There was an issue storing the order details. Please try again.");
    }
  };

  // Razorpay payment integration
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Failed to load Razorpay SDK. Are you online?");
    };
    script.onload = async () => {
      try {
        const orderId = generateOrderId(); // Generate the unique order ID
        const options = {
          key: "rzp_test_DT1FmIE6tqtiAQ", // Replace this with your Razorpay key
          amount: totalAmount * 100, 
          currency: "INR",
          name: "Your Shop Name",
          description: "Test Transaction",
          image: "https://your-logo-url.com", // Add your shop's logo
          handler: function (response) {
            // Handle successful payment here
            alert("Payment successful! Payment ID: " + response.razorpay_payment_id);

            // Store the order details in Firestore after payment success
            storeOrderDetails(response.razorpay_payment_id, orderId);
          },
          prefill: {
            name: userName,
            email: "john.doe@example.com",
            contact: userPhone
          },
          notes: {
            address: userAddress
          },
          theme: {
            color: "#F37254"
          }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.log("Razorpay Error: ", error);
        alert("Something went wrong with the payment.");
      }
    };
    document.body.appendChild(script);
  };

  const handlePayment = () => {
    loadRazorpay();
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <Typography variant="h4" gutterBottom>
          Payment
        </Typography>
      </div>
      <div className="payment-content">
        {cartItems.length > 0 ? (
          <>
            <Grid container spacing={2} justifyContent="center" className="payment-items">
              {cartItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ maxWidth: 345 }} className="payment-card">
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt={item.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                        Price: ₹{item.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div className="payment-actions">
              <Typography variant="h5" component="div" className="total-amount">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                className="payment-button"
              >
                Proceed to Pay
              </Button>
            </div>
          </>
        ) : (
          <Typography variant="body1">No items to display.</Typography>
        )}
      </div>
    </div>
  );
}

export default Payment;
