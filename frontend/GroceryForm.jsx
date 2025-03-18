import { useState } from "react";
import axios from "axios";

const GroceryForm = ({ fetchItems }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    expiryDate: "",
    category: "",
    manufactureDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/groceries", formData);
    fetchItems(); // Refresh the item list
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
      <input
        type="text"
        name="itemName"
        placeholder="Enter Grocery Name"
        className="border rounded w-full p-2 my-2"
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="expiryDate"
        className="border rounded w-full p-2 my-2"
        onChange={handleChange}
        required
      />
      <select
        name="category"
        className="border rounded w-full p-2 my-2"
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="Dairy">Dairy</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Fruits">Fruits</option>
      </select>
      <input
        type="date"
        name="manufactureDate"
        className="border rounded w-full p-2 my-2"
        onChange={handleChange}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Item
      </button>
    </form>
  );
};

export default GroceryForm;
