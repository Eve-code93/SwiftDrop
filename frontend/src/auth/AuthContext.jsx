import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app load, check for token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = ({ token }) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access context
export const useAuth = () => useContext(AuthContext);
