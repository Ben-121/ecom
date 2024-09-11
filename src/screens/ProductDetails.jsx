import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../components/firebase'; // Import both Firestore and Auth from your Firebase setup
import { collection, doc, getDoc, getDocs, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './ProductDetails.css';

function ProductDetails() {
  const { productDetailsId } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null); // Product details from Firestore
  const [reviews, setReviews] = useState([]); // All reviews for this product
  const [reviewText, setReviewText] = useState(""); // Text of the review being written
  const [user, setUser] = useState(null); // Current authenticated user
  const [rating, setRating] = useState(5); // Rating value
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDoc = doc(db, 'products', productDetailsId); // Get the product document reference
        const productSnapshot = await getDoc(productDoc); // Fetch the document from Firestore

        if (productSnapshot.exists()) {
          setProduct(productSnapshot.data()); // Set the product data in state
        } else {
          console.error("No product found with the provided ID.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    // Fetch reviews for the product from Firestore
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, `products/${productDetailsId}/reviews`);
        const reviewSnapshot = await getDocs(reviewsCollection);
        const fetchedReviews = reviewSnapshot.docs.map(doc => doc.data());
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // Fetch user's first name from Firestore based on the provided format
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUser({
            uid: currentUser.uid,
            firstName: userData.firstName,
          });
        } else {
          // If no user data in Firestore, fall back to default values
          setUser({
            uid: currentUser.uid,
            firstName: "Anonymous",
          });
        }
      } else {
        setUser(null); // User is signed out
      }
    });

    fetchProductDetails();
    fetchReviews();

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [productDetailsId]);

  const handleAddReview = async () => {
    if (reviewText.trim() && user) {
      try {
        const reviewData = {
          text: reviewText,
          timestamp: Timestamp.now(),
          rating: rating,
          productId: productDetailsId, // Reference to the product being reviewed
        };

        // // Store review in user's subcollection "reviews" using uid
        // const userReviewRef = doc(db, `users/${user.uid}/reviews`, productDetailsId);
        // await setDoc(userReviewRef, reviewData); // Set the review with the product ID as the document ID

        // Optionally, you can store the review under the product's collection as well (for product-based fetching)
        const productReviewRef = doc(db, `products/${productDetailsId}/reviews`, user.uid);
        await setDoc(productReviewRef, {
          ...reviewData,
          userName: user.firstName, // Use the first name from Firestore
        });

        setReviews([...reviews, { ...reviewData, userName: user.firstName, userProfile: user.photoURL }]);
        setReviewText("");
      } catch (error) {
        console.error("Error adding review:", error);
      }
    } else {
      alert("You must be logged in to add a review.");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < rating ? <StarIcon key={index} style={{ color: '#ffc107' }} /> : <StarBorderIcon key={index} />
    ));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="product-details">
        <h1>{product.title}</h1>
        <img src={product.image} alt={product.title} />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <button onClick={() => navigate('/')}>Go Back</button>

        <div className="review-section">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul>
              {reviews.map((review, index) => (
                <li key={index} className="review-item">
                  <div className="review-header">
                    <div className="review-info">
                      <p className="review-name">{review.userName}</p>
                    </div>
                  </div>

                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>

                  <div className="review-content">
                    <p>{review.text.length > 150 ? `${review.text.slice(0, 150)}...` : review.text}</p>
                    {review.text.length > 150 && (
                      <span className="show-more" onClick={() => alert('Show more clicked')}>
                        Show more
                      </span>
                    )}
                  </div>

                  <small className="review-timestamp">
                    {new Date(review.timestamp.seconds * 1000).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}

          <div className="add-review">
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Add your review here..."
            />
            <button onClick={handleAddReview}>Add a Review</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;