import React, { createContext, useState, useContext } from 'react';

// Create a context for the shop
const ShopContext = createContext();

// Shop provider component
export const ShopProvider = ({ children }) => {
  const [globalshop, setShopGlobal] = useState(null);  // Store shop data in state

  return (
    <ShopContext.Provider value={{ globalshop, setShopGlobal }}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to access the shop context
export const useShop = () => useContext(ShopContext);
