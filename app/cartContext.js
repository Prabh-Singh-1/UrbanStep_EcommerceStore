"use client";
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setcart] = useState({});
  const [cartClick, setcartClick] = useState(false)
  const [cartDot, setcartDot] = useState(0)
  const [subtotal, setsubtotal] = useState(0)
  const [userCred, setUserCred] = useState(null);
  const [isUserCredLoaded, setIsUserCredLoaded] = useState(false);



  useEffect(() => {
    const storedDot = localStorage.getItem('cartDot');
    const parsedDot = parseInt(storedDot);
    if (!isNaN(parsedDot)) {
      setcartDot(parsedDot);
    } else {
      setcartDot(0);
    }

    const storedUser = Cookies.get('userCred');
    if (storedUser) {
      try {
        const decoded = decodeURIComponent(storedUser);
        setUserCred(JSON.parse(decoded));
        setIsUserCredLoaded(true);
      } catch (err) {
        console.error("Failed to parse stored userCred:", err);
      }
    }

    const storedTotal = localStorage.getItem("subTotal");
    if (storedTotal) {
      const parsedTotal = JSON.parse(storedTotal);
      setsubtotal(parsedTotal);
     
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('cartDot', JSON.stringify(cartDot));
  }, [cartDot]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("subTotal", JSON.stringify(subtotal));
   
  }, [subtotal]);

  return (
    <CartContext.Provider value={{ cart, setcart, cartClick, setcartClick, cartDot, setcartDot, subtotal, setsubtotal, userCred, setUserCred, isUserCredLoaded }}>
      {children}
    </CartContext.Provider>
  );
};
