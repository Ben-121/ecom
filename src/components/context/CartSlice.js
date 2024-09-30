// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db,auth } from '../Firebase';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    cartCount: 0,
    loading: true,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    updateCartCount: (state) => {
      state.cartCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      state.cartCount += 1;
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.cartCount -= state.cartItems[itemIndex].quantity;
        state.cartItems.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (quantity > 0) {
        state.cartItems[index].quantity = quantity;
      }
      state.cartCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },
  },
});

export const {
  setCartItems,
  updateCartCount,
  setLoading,
  addToCart,
  removeFromCart,
  updateQuantity,
} = cartSlice.actions;

export const fetchCartItems = () => async (dispatch) => {
  dispatch(setLoading(true));
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const cartRef = doc(db, 'cart', userId);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const fetchedCartItems = cartDoc.data().items || [];
      dispatch(setCartItems(fetchedCartItems));
      dispatch(updateCartCount());
    } else {
      dispatch(setCartItems([]));
      dispatch(updateCartCount());
    }
  } else {
    dispatch(setCartItems([]));
    dispatch(updateCartCount());
  }

  dispatch(setLoading(false));
};

export const syncCartWithFirebase = (cartItems) => async () => {
  const userId = auth.currentUser?.uid;
  if (userId) {
    const cartRef = doc(db, 'cart', userId);
    await setDoc(cartRef, { items: cartItems });
  }
};

export default cartSlice.reducer;
