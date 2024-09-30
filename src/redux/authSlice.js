  import { createSlice } from "@reduxjs/toolkit";
  import CryptoJS from "crypto-js"; // Import crypto-js for encryption

  // Decryption function
  const decryptData = (encryptedData) => {
    if (!encryptedData) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'your-encryption-secret-key');
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };

  // Load encrypted user data from localStorage or sessionStorage
  const savedUser =
    decryptData(localStorage.getItem("encryptedUserData")) ||
    null;

  console.log(savedUser, "trigger storage");

  const authSlice = createSlice({
    name: "auth",
    initialState: {
      user: savedUser, // set initial value from localStorage or sessionStorage
    },
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
        
        // Encrypt user data
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(action.payload), 'your-encryption-secret-key').toString();

        if (action.payload.rememberMe) {
          localStorage.setItem("encryptedUserData", encryptedData);
        } else {
          sessionStorage.setItem("encryptedUserData", encryptedData);
        }
      },
      clearUser: (state) => {
        state.user = null;
        localStorage.removeItem("encryptedUserData");
        sessionStorage.removeItem("encryptedUserData");
      },
    },
  });

  export const { setUser, clearUser } = authSlice.actions;
  export default authSlice.reducer;
