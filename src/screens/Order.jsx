import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Divider } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../components/firebase"; 

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const ordersQuery = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(ordersQuery);
          const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        }
      } catch (err) {
        setError("Error fetching orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (orders.length === 0) {
    return <Typography variant="h6">No recent orders found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recent Orders
        </Typography>
        <List>
          {orders.map((order) => (
            <Box key={order.id} mb={2}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order.orderId}`}
                  secondary={`Total: ₹${order.totalAmount.toFixed(2)} | Date: ${new Date(
                    order.createdAt.seconds * 1000
                  ).toLocaleDateString()}`}
                />
              </ListItem>
              <Typography variant="body1">Items:</Typography>
              <ul>
                {order.cartItems.map((item, index) => (
                  <li key={index}>
                    {item.title} (x{item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <Divider />
            </Box>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default RecentOrders;