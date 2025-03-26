import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ Send cookies for auth
});

// Register User
export const registerUser = async (userData) => API.post("/auth/register", userData);

// Login User
export const loginUser = async (userData) => API.post("/auth/login", userData);

// Logout User
export const logoutUser = async () => API.post("/auth/logout"); 

// Create Family Group
export const createFamilyGroup = async (groupData) => API.post("/family/create-family-group", groupData);

// Join Family Group
export const joinFamilyGroup = async (groupData) => API.post("/family/join-family", groupData);

// Logout Family Group
export const logoutFamilyGroup = async () => API.post("/family/logout"); 

