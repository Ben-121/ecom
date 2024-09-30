import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../components/Firebase'; 
import { useDispatch } from "react-redux"; 
import { setUser } from '../redux/authSlice';
import CryptoJS from 'crypto-js'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  // Check for existing session data on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const encryptedUserData = sessionStorage.getItem('encryptedUserData') || localStorage.getItem('encryptedUserData');

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    if (encryptedUserData) {
      try {
        const decryptedData = CryptoJS.AES.decrypt(encryptedUserData, 'your-encryption-secret-key').toString(CryptoJS.enc.Utf8);
        const userDetails = JSON.parse(decryptedData);

        // Dispatch the user data to Redux store
        dispatch(setUser(userDetails));
        
        // Redirect the user based on their role
        navigate(userDetails.isSeller ? '/seller-dashboard' : '/');
      } catch (error) {
        console.error('Error decrypting user data:', error);
      }
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Attempt to sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      // Retrieve user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Combine user details
        const userDetails = {
          uid: user.uid,
          name: userData.firstName || "Guest",
          email: user.email,
          isSeller: userData.isSeller || false,
          mobileNumber: userData.mobileNumber || "",
        };

        // Encrypt user details
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userDetails), 'your-encryption-secret-key').toString();

        // Store encrypted data based on "Remember Me"
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('encryptedUserData', encryptedData);
        } else {
          localStorage.removeItem('rememberedEmail');
          sessionStorage.setItem('encryptedUserData', encryptedData);
        }

        // Dispatch user data to Redux store
        dispatch(setUser({
          ...userDetails,
          rememberMe: rememberMe,
        }));

        navigate(userData.isSeller ? '/seller-dashboard' : '/');
      } else {
        console.log("No such document!");
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Remember me"
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={() => navigate('/signup')}>Don't have an account? Sign Up</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
