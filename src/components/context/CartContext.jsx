import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, setCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
