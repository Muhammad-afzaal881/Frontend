import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("apniDukanCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("apniDukanCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to Cart with Quantity Logic
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(0, (item.quantity || 1) - 1) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, increaseQty, decreaseQty, 
      removeFromCart, clearCart, totalItems, subtotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};