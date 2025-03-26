import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api"; // ✅ Import user logout API
import { logoutFamilyGroup } from "../api/api"; // ✅ Import family logout API

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null); // "individual" or "family"
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedType = localStorage.getItem("accountType");

    if (storedUser && storedType) {
      setUser(JSON.parse(storedUser));
      setAccountType(storedType);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAccountType("individual");

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accountType", "individual");
    localStorage.setItem("token", token); // Store JWT token

    navigate("/");
  };

  const joinFamily = (familyData) => {
    setUser(familyData);
    setAccountType("family");

    localStorage.setItem("user", JSON.stringify(familyData));
    localStorage.setItem("accountType", "family");
  
    navigate("/");
  };

  const logout = async () => {
    try {
      if (accountType === "individual") {
        await logoutUser(); 
        console.log("Individual logout successful");
      } else if (accountType === "family") {
        await logoutFamilyGroup(); 
        console.log("Family logout successful");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }

    setUser(null);
    setAccountType(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accountType");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, accountType, login, joinFamily, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
