import React, { useState, useEffect } from 'react';
import { auth, db } from '../components/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import './ActivityHistory.css';

function ActivityHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending

  useEffect(() => {
    const fetchActivityHistory = async (userId) => {
      const activityRef = doc(db, 'activityHistory', userId);

      try {
        const docSnap = await getDoc(activityRef);
        if (docSnap.exists()) {
          let activities = docSnap.data().activities || [];

          // Create a map to track unique activities based on the title
          const uniqueActivityMap = new Map();
          activities.forEach((activity) => {
            // If activity already exists, update its position to be the most recent
            uniqueActivityMap.set(activity.title, activity);
          });

          // Convert the map back to an array to maintain only unique items with most recent ones at the end
          const uniqueActivities = Array.from(uniqueActivityMap.values());

          // Sort the activities by timestamp in descending order (most recent first)
          uniqueActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          setHistory(uniqueActivities);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching activity history:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchActivityHistory(user.uid);
      } else {
        setLoading(false); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);

    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setHistory(sortedHistory);
  };

  return (
    <div className="activity-history-container">
      <h2>Activity History</h2>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSortToggle} 
        style={{ marginBottom: '20px' }}
      >
        Sort by Timestamp ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
          <Typography variant="body2">Loading your activity history...</Typography>
        </div>
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
