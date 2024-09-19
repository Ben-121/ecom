import React, { useState, useEffect } from 'react';
import { auth, db } from '../components/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import './ActivityHistory.css';

function ActivityHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchActivityHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const activityRef = doc(db, 'activityHistory', userId);

        try {
          const docSnap = await getDoc(activityRef);
          if (docSnap.exists()) {
            const activities = docSnap.data().activities || [];
            setHistory(activities);
          } else {
            setHistory([]);
          }
        } catch (error) {
          console.error("Error fetching activity history:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchActivityHistory();
  }, []);

  const sortHistoryByTimestamp = (order) => {
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      if (order === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setHistory(sortedHistory);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortHistoryByTimestamp(newOrder);
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
        <div>Loading...</div>
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
