import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Inventory() {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    category: 'Other',
  });
  const [inventoryList, setInventoryList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/inventory/${userId}`);
      setInventoryList(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory items.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || formData.name.length < 2) {
      setError('Item name must be at least 2 characters long.');
      return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError('Item name can only contain letters and spaces.');
      return;
    }
    if (!formData.quantity || formData.quantity < 0) {
      setError('Quantity must be a non-negative number.');
      return;
    }
    if (formData.expiryDate && isNaN(new Date(formData.expiryDate).getTime())) {
      setError('Please enter a valid expiry date.');
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        const response = await axios.put(`http://localhost:7001/api/inventory/${editingItem._id}`, {
          ...formData,
          quantity: Number(formData.quantity),
          userId,
        });
        setInventoryList(
          inventoryList.map((item) => (item._id === editingItem._id ? response.data : item))
        );
        setEditingItem(null);
      } else {
        // Create new item
        const response = await axios.post('http://localhost:7001/api/inventory', {
          ...formData,
          quantity: Number(formData.quantity),
          userId,
        });
        setInventoryList([response.data, ...inventoryList]);
      }
      setSuccess(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
      setError(null);
      setFormData({ name: '', quantity: '', expiryDate: '', category: 'Other' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error submitting inventory item:', error);
      setError('Failed to submit item: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      category: item.category,
    });
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:7001/api/inventory/${itemId}`);
        setInventoryList(inventoryList.filter((item) => item._id !== itemId));
        setSuccess('Item deleted successfully!');
        setError(null);
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting item:', error);
        setError('Failed to delete item: ' + error.message);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/close-up-food-preservation-method_23-2149185613.jpg?t=st=1746549019~exp=1746552619~hmac=874c45103b6235dfb010e5accfdcd44bb4d7d22d793668ba3fcf8b8ae87ac817&w=996)`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 md:bg-black/40 lg:bg-black/30"></div>

      <div className="relative min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/80 to-gray-900/80 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <NavLink to="/">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                  alt="Header Logo"
                  className="w-12 h-12 object-contain hover:scale-105 transition-transform duration-300"
                />
              </NavLink>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
                Home Stock
              </h1>
            </div>
            <nav className="flex space-x-4 md:space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/notification-and-expiry-alerts"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Notifications
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Inventory
              </NavLink>
              <NavLink
                to="/meal-planning-dashboard"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Meal Planning
              </NavLink>
              <NavLink
                to="/notification-settings"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Settings
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-10">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col lg:flex-row lg:space-x-16">
              {/* Left Side: Inventory Form */}
              <motion.div
                className="w-full lg:w-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 z-10 lg:-mr-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent drop-shadow-lg">
                    {editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
                  </h1>
                  <Link
                    to="/"
                    className="text-blue-700 hover:text-white text-sm font-medium transition-colors duration-300"
                  >
                    Back to Home
                  </Link>
                </motion.div>

                {error && (
                  <motion.p
                    className="text-red-300 bg-red-900/30 p-3 rounded-lg mb-6 font-medium border border-red-500/40 shadow-sm"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    className="text-green-300 bg-green-900/30 p-3 rounded-lg mb-6 font-medium border border-green-500/40 shadow-sm"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {success}
                  </motion.p>
                )}

                {/* Inventory Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold text-gray-100 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      placeholder="Enter item name"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold text-gray-100 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      placeholder="Enter quantity"
                      min="0"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold text-gray-100 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold text-gray-100 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white shadow-sm"
                    >
                      <option value="Food">Food</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Household">Household</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Other">Other</option>
                    </select>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </motion.button>
                  {editingItem && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setFormData({ name: '', quantity: '', expiryDate: '', category: 'Other' });
                      }}
                      className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel Edit
                    </motion.button>
                  )}
                </form>
              </motion.div>

              {/* Right Side: Inventory List */}
              <div className="w-full lg:w-2/3 bg-gradient-to-br from-gray-900/30 to-gray-900/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30 lg:ml-32 mt-8 lg:mt-0">
                {inventoryList.length > 0 && (
                  <motion.div
                    className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900"
                    variants={containerVariants}
                  >
                    <div className="sticky top-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 backdrop-blur-md p-4 rounded-t-lg shadow-md z-10">
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400 drop-shadow-lg">
                        Your Inventory
                      </h2>
                    </div>
                    <div className="space-y-4 p-4">
                      {inventoryList.map((item) => (
                        <motion.div
                          key={item._id}
                          className="bg-gray-900/50 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-700/40 hover:shadow-xl hover:bg-gray-900/70 transition-all duration-300"
                          variants={itemVariants}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-blue-400">{item.name}</span>
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-green-300 hover:text-blue-200 text-sm font-medium transition-colors duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-400 hover:text-red-200 text-sm font-medium transition-colors duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-100 font-semibold">Quantity: {item.quantity}</p>
                          {item.expiryDate && (
                            <p className="text-gray-200">
                              Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-gray-100 ">Category: {item.category}</p>
                          <p className="text-gray-400 text-xs mt-2">
                            Last Updated: {new Date(item.updatedAt).toLocaleString()}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {inventoryList.length === 0 && (
                  <motion.div
                    className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/40 text-center"
                    variants={itemVariants}
                  >
                    <p className="text-gray-300 text-lg">No inventory items yet. Add items to get started!</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full bg-gradient-to-r from-gray-900/80 to-gray-900/80 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Footer Logo"
                className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
              />
              <p className="text-white text-sm md:text-base">© 2025 Home Stock. All rights reserved.</p>
            </div>
            <div className="flex justify-center space-x-4 md:space-x-6 mb-4">
              <a href="/about" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
                About
              </a>
              <a href="/contact" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
                Contact
              </a>
              <a href="/privacy-policy" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Inventory;