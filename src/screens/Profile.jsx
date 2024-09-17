import React, { useEffect, useState } from "react";
import { Container, Typography, Box, TextField, Button, CircularProgress } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { updatePassword } from "firebase/auth"; // For changing password
import { toast } from 'react-toastify'; // Optional: For better notifications

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    mobileNumber: "",
    address: "",
  });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserDetails(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          firstName: userDetails.firstName,
          mobileNumber: userDetails.mobileNumber,
          address: userDetails.address,
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <form onSubmit={handleUpdateProfile}>
          <TextField
            fullWidth
            label="First Name"
            value={userDetails.firstName}
            onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mobile Number"
            value={userDetails.mobileNumber}
            onChange={(e) => setUserDetails({ ...userDetails, mobileNumber: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            value={userDetails.address}
            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={updating}
          >
            {updating ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
        </form>

        {/* Change Password Section */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Change Password
        </Typography>
        <form onSubmit={handleChangePassword}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb:3 }}
            disabled={newPassword.length === 0 || confirmPassword.length === 0}
          >
            Change Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;
