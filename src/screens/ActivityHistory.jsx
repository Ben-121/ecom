import React, { useState, useEffect } from 'react';
import { auth, db } from '../components/Firebase'; // Import Firebase auth and Firestore
import { doc, onSnapshot } from 'firebase/firestore'; // Firestore real-time listener
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button'; // Import Button for sorting
import './ActivityHistory.css';

function ActivityHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid; // Get user UID
        const activityRef = doc(db, 'activityHistory', userId); // Reference to the user's activity in Firestore

        // Real-time listener to fetch activity history from Firestore
        const unsubscribeFromSnapshot = onSnapshot(activityRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const activities = docSnapshot.data().activities || []; // Fetch 'activities' array
            setHistory(activities); // Set the history state with the fetched activities
          } else {
            setHistory([]); // No activity found
          }
          setLoading(false); // Stop loading once data is fetched
        });

        // Cleanup Firestore listener when component unmounts
        return () => unsubscribeFromSnapshot();
      } else {
        setLoading(false); // Stop loading if no user is authenticated
      }
    });

    // Cleanup auth listener when component unmounts
    return () => unsubscribeFromAuth();
  }, []);

  // Function to sort history based on timestamp
  const sortHistoryByTimestamp = (order) => {
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      if (order === 'asc') {
        return dateA - dateB; // Ascending order
      } else {
        return dateB - dateA; // Descending order
      }
    });

    setHistory(sortedHistory); // Update the history state with the sorted data
  };

  // Toggle sort order and call the sorting function
  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortHistoryByTimestamp(newOrder);
  };

  return (
    <div className="activity-history-container">
      <h2>Activity History</h2>
      
      {/* Sort Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSortToggle} 
        style={{ marginBottom: '20px' }}
      >
        Sort by Timestamp ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>

      {loading ? (
        <div>Loading...</div> // Show loading indicator while waiting for data
      ) : history.length > 0 ? (
        <div className="history-grid">
          {history.map((item, index) => (
            <Card sx={{ width: 300 }} key={index} className="history-item">
              <CardActionArea>
                <CardMedia
                  component="img"
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'contain',
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
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Action: {item.action}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Added At: {item.timestamp}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      ) : (
        <div>No activity history available.</div>
      )}
    </div>
  );
}

export default ActivityHistory;