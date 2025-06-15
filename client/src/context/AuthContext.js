import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuth, 
        setIsAuth,
        loading,
        setLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
  