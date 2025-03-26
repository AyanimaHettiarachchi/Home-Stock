import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Ensure cookies are sent with requests
});

// CRUD Operations for Items
export const getItems = async () => API.get("/items");
export const getItem = async (id) => API.get(`/items/${id}`);
export const createItem = async (itemData) => API.post("/items", itemData);
export const updateItem = async (id, itemData) => API.put(`/items/${id}`, itemData);
export const deleteItem = async (id) => API.delete(`/items/${id}`);

// 🔥 Add Logout API call
export const logoutUser = async () => API.post("/auth/logout");
