import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [role, setRole] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser).role : null; // Access the role here
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const login = (newToken, userInfo) => {
    console.log("AuthContext: Setting new token and user data:", newToken, userInfo);
    if (newToken) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setToken(newToken);
      setUser(userInfo);
      setRole(userInfo.role);
      setIsAuthenticated(true);
      console.log("AuthContext: Token and user info saved, state updated");
    } else {
      console.log("AuthContext: Attempted to set null/undefined token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    token,
    user,
    role,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
