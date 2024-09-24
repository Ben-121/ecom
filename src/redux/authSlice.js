import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("userDetails")) || null;
console.log(savedUser,"trigger localStorage");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser, // set initial value from localstorag
  },
  reducers: {
    setUser: (state, action) => {//save
      state.user = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
    },
    clearUser: (state) => {//deelete
      state.user = null;
      localStorage.removeItem("userDetails");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
