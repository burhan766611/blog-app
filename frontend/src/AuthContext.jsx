import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../api/axiosConfig";

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await API.get("/me");
        setIsLoggedIn(res.data.success);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

