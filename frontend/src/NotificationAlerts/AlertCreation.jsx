import { useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function AlertCreation() {
  const [newAlert, setNewAlert] = useState({
    type: 'expiry',
    message: '',
    itemId: '',
    userId: '507f1f77bcf86cd799439011', // Replace with a real userId from your database
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAlert.message.trim()) {
      setError('Message is required.');
      return;
    }
    if (
      !confirm(
        `Create ${newAlert.type === 'expiry' ? 'Expiry' : 'Low Stock'} Alert: "${
          newAlert.message
        }"${newAlert.itemId ? ` for Item ID ${newAlert.itemId}` : ''}?`
      )
    ) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:7001/api/notifications', newAlert);
      setSuccess(true);
      setError(null);
      setNewAlert({ type: 'expiry', message: '', itemId: '', userId: newAlert.userId });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating alert:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to create alert.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
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
        backgroundImage: `url(https://img.freepik.com/free-photo/woman-shopping-grocery-store-talking-phone_1303-16009.jpg?t=st=1742562385~exp=1742565985~hmac=ad5690177021ab97ae3baf336b8d4f3d272f1bc0060b38d76c323f9e0141e0a3&w=996)`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 md:bg-black/40 lg:bg-black/30"></div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
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

        <main className="flex-1 px-4 md:px-6 py-10 flex items-center justify-center">
          <motion.div
            className="w-full max-w-lg bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Alert
              </h1>
              <Link
                to="/notification-and-expiry-alerts"
                className="text-blue-600 hover:text-blue-900 text-lg font-medium transition-colors"
              >
                Back
              </Link>
            </motion.div>

            {error && (
              <motion.p
                className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 font-medium"
                variants={itemVariants}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-600 bg-green-50 p-3 rounded-lg mb-6 font-medium"
                variants={itemVariants}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Alert created successfully!
              </motion.p>
            )}

            <form onSubmit={handleCreate} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alert Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="expiry">Expiry</option>
                  <option value="low-stock">Low Stock</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <input
                  type="text"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter alert message"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item ID (Optional)</label>
                <input
                  type="text"
                  value={newAlert.itemId}
                  onChange={(e) => setNewAlert({ ...newAlert, itemId: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter item ID (optional, e.g., item-001)"
                />
              </motion.div>

              {newAlert.message && (
                <motion.div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner" variants={itemVariants}>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Preview</h3>
                  <p className="text-gray-700 text-sm">
                    {newAlert.type === 'expiry' ? 'Expiry Alert' : 'Low Stock Alert'}: {newAlert.message}
                  </p>
                  {newAlert.itemId && <p className="text-xs text-gray-500 mt-1">Item ID: {newAlert.itemId}</p>}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Alert
              </motion.button>
            </form>
          </motion.div>
        </main>

   {/*Footer*/}
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
              <a
                href="#about"
                className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
              >
                Contact
              </a>
              <a
                href="#privacy"
                className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Powered by AT</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AlertCreation;