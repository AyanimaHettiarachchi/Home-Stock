import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotificationSettings() {
  const defaultPreferences = {
    name: '',
    emailNotifications: true,
    push: true,
    frequency: 'daily',
    timeZone: 'UTC',
    lowStockThreshold: 10,
    expiryThresholdDays: 7,
  };

  const [preferences, setPreferences] = useState(defaultPreferences);
  const [formData, setFormData] = useState(defaultPreferences);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [preferencesExist, setPreferencesExist] = useState(false); // Track if preferences exist
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID (e.g., from auth)

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/preferences/${userId}`);
      const fetchedPreferences = response.data;
      setPreferences(fetchedPreferences);
      setFormData(fetchedPreferences);
      // Check if preferences exist by verifying if the response has an _id (indicating it was saved in the database)
      setPreferencesExist(!!fetchedPreferences._id);
      setError(null);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Failed to load preferences.');
      setPreferences(defaultPreferences);
      setFormData(defaultPreferences);
      setPreferencesExist(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || formData.name.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    if (formData.lowStockThreshold < 1 || formData.expiryThresholdDays < 1) {
      setError('Threshold values must be at least 1.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:7001/api/notifications/preferences/${userId}`, formData);
      setPreferences(response.data);
      setPreferencesExist(true); // Preferences now exist after saving
      setSuccess('Preferences saved successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences: ' + error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || formData.name.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    if (formData.lowStockThreshold < 1 || formData.expiryThresholdDays < 1) {
      setError('Threshold values must be at least 1.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:7001/api/notifications/preferences/${userId}`, formData);
      setPreferences(response.data);
      setSuccess('Preferences updated successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your preferences? This will reset them to default values.')) {
      try {
        await axios.delete(`http://localhost:7001/api/notifications/preferences/${userId}`);
        setPreferences(defaultPreferences);
        setFormData(defaultPreferences);
        setPreferencesExist(false); // Preferences no longer exist after deletion
        setSuccess('Preferences deleted successfully!');
        setError(null);
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting preferences:', error);
        setError('Failed to delete preferences: ' + error.message);
      }
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
        backgroundImage: `url(https://img.freepik.com/free-photo/portrait-satisfied-good-looking-female-red-dress-with-curly-hair-combed-bun_176420-24624.jpg?t=st=1742535095~exp=1742538695~hmac=a4306e4c134d6214435b55f399a8e8cd3ad347def355eada9ec02be9b33d35d3&w=996)`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 md:bg-black/40 lg:bg-black/30"></div>

      <div className="relative min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/90 to-gray-900/90 backdrop-blur-md shadow-lg">
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
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/notification-and-expiry-alerts"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                Notifications
              </NavLink>
              <NavLink
                to="/notification-settings"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                Settings
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-10 flex items-center justify-center">
          <motion.div
            className="w-full max-w-2xl bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notification Settings
              </h1>
              <Link to="/notification-and-expiry-alerts" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                Back to Notifications
              </Link>
            </motion.div>

            {error && (
              <motion.p
                className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 font-medium border border-red-200"
                variants={itemVariants}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-600 bg-green-50 p-3 rounded-lg mb-6 font-medium border border-green-200"
                variants={itemVariants}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {success}
              </motion.p>
            )}

            {/* Current Preferences Display */}
            <motion.div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-inner" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Preferences</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Name:</span> {preferences.name || 'Not set'}</p>
                <p><span className="font-medium">Email Notifications:</span> {preferences.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                <p><span className="font-medium">Push Notifications:</span> {preferences.push ? 'Enabled' : 'Disabled'}</p>
                <p><span className="font-medium">Frequency:</span> {preferences.frequency}</p>
                <p><span className="font-medium">Time Zone:</span> {preferences.timeZone}</p>
                <p><span className="font-medium">Low Stock Threshold:</span> {preferences.lowStockThreshold}</p>
                <p><span className="font-medium">Expiry Threshold (Days):</span> {preferences.expiryThresholdDays}</p>
              </div>
            </motion.div>

            {/* Update Preferences Form */}
            <form onSubmit={handleSave} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter your name"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Channels</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-200 rounded"
                    />
                    <span className="ml-3 text-gray-700 text-sm">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.push}
                      onChange={(e) => setFormData({ ...formData, push: e.target.checked })}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-200 rounded"
                    />
                    <span className="ml-3 text-gray-700 text-sm">Push Notifications</span>
                  </label>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="instant">Instant</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Zone</label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="UTC">UTC</option>
                  <option value="PST">PST</option>
                  <option value="EST">EST</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Low Stock Threshold</label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  min="1"
                  placeholder="e.g., 10"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Threshold (Days)</label>
                <input
                  type="number"
                  value={formData.expiryThresholdDays}
                  onChange={(e) => setFormData({ ...formData, expiryThresholdDays: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  min="1"
                  placeholder="e.g., 7"
                />
              </motion.div>

              <div className="flex space-x-4">
                <motion.button
                  type="submit"
                  disabled={preferencesExist} // Disable if preferences already exist
                  className={`flex-1 p-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                    preferencesExist
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                  variants={itemVariants}
                  whileHover={preferencesExist ? {} : { scale: 1.02 }}
                  whileTap={preferencesExist ? {} : { scale: 0.98 }}
                >
                  Save All Settings
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleUpdate}
                  disabled={!preferencesExist} // Enable only if preferences exist
                  className={`flex-1 p-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                    !preferencesExist
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'
                  }`}
                  variants={itemVariants}
                  whileHover={!preferencesExist ? {} : { scale: 1.02 }}
                  whileTap={!preferencesExist ? {} : { scale: 0.98 }}
                >
                  Update All Settings
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleDelete}
                  disabled={!preferencesExist} // Enable only if preferences exist
                  className={`flex-1 p-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                    !preferencesExist
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  variants={itemVariants}
                  whileHover={!preferencesExist ? {} : { scale: 1.02 }}
                  whileTap={!preferencesExist ? {} : { scale: 0.98 }}
                >
                  Delete All Preferences
                </motion.button>
              </div>
            </form>
          </motion.div>
        </main>

        <footer className="w-full bg-gradient-to-r from-gray-900/90 to-gray-900/90 backdrop-blur-md shadow-lg">
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
              <a href="#about" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
                About
              </a>
              <a href="#contact" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
                Contact
              </a>
              <a href="#privacy" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
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

export default NotificationSettings;