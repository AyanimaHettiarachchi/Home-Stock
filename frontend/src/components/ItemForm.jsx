// ItemForm.jsx
import { useState, useEffect } from "react";

const ItemForm = ({ onSubmit, itemToEdit }) => {
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    category: "",
    expiryDate: "",
  });

  const categories = ["Dairy", "Vegetables", "Fruits", "Frozen items", "Snack"];

  useEffect(() => {
    if (itemToEdit) {
      setItem({
        ...itemToEdit,
        expiryDate: itemToEdit.expiryDate 
          ? new Date(itemToEdit.expiryDate).toISOString().split("T")[0] 
          : "",
      });
    } else {
      setItem({ name: "", quantity: "", category: "", expiryDate: "" }); // ✅ Reset form
    }
  }, [itemToEdit]);
  

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(item);
    if (!itemToEdit) {
      setItem({ name: "", quantity: "", category: "", expiryDate: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {itemToEdit ? "✏️ Edit Item" : "➕ Add New Item"}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Milk, Apples"
            value={item.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="e.g. 2"
            value={item.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={item.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={item.expiryDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
        >
          {itemToEdit ? "Update Item" : "Add to Inventory"}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;