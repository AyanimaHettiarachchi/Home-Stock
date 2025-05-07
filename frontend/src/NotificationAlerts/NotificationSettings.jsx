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
    // New validation: Name should only contain letters and spaces (no numbers or special characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError('Name can only contain letters and spaces (no numbers or special characters).');
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
    // New validation: Name should only contain letters and spaces (no numbers or special characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError('Name can only contain letters and spaces (no numbers or special characters).');
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
        backgroundImage: `url(https://img.freepik.com/free-photo/workers-comparing-graphics_1150-158.jpg?t=st=1743309111~exp=1743312711~hmac=b8408fc4f3c46d74d3c7101c45b848e5b93a7cf345ed6eb6d9f5ee8c43c0d6cb&w=826)`,
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

        <main className="flex-1 px-4 md:px-6 py-10">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col lg:flex-row lg:space-x-16">
              {/* Left Side: Settings Form */}
              <motion.div
                className="w-full lg:w-2/3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 z-10 lg:-mr-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
                  <h1 className="text-3xl md:text-4xl font-bold bg-white bg-clip-text text-transparent drop-shadow-lg">
                    Notification Settings
                  </h1>
                  <Link
                    to="/notification-and-expiry-alerts"
                    className="text-blue-400 hover:text-blue-600 text-base font-medium transition-colors flex items-center"
                    aria-label="Back to Notification Home"
                  >
                    ← Back
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

                {/* Settings Form */}
                <form onSubmit={handleSave} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Notification Channels</label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.emailNotifications}
                          onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                        />
                        <span className="ml-3 text-gray-100 text-sm">Email Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.push}
                          onChange={(e) => setFormData({ ...formData, push: e.target.checked })}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                        />
                        <span className="ml-3 text-gray-100 text-sm">Push Notifications</span>
                      </label>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Notification Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white shadow-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="instant">Instant</option>
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Time Zone</label>
                    <select
                      value={formData.timeZone}
                      onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white shadow-sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="PST">PST</option>
                      <option value="EST">EST</option>
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      min="1"
                      placeholder="e.g., 10"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Expiry Threshold (Days)</label>
                    <input
                      type="number"
                      value={formData.expiryThresholdDays}
                      onChange={(e) => setFormData({ ...formData, expiryThresholdDays: Number(e.target.value) })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      min="1"
                      placeholder="e.g., 7"
                    />
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.button
                      type="submit"
                      disabled={preferencesExist}
                      className={`flex-1 p-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                        preferencesExist
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
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
                      disabled={!preferencesExist}
                      className={`flex-1 p-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                        !preferencesExist
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
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
                      disabled={!preferencesExist}
                      className={`flex-1 p-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                        !preferencesExist
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
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

              {/* Right Side: Current Preferences Display */}
              <div className="w-full lg:w-2/3 bg-gradient-to-br from-gray-900/30 to-gray-900/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30 lg:ml-32 mt-8 lg:mt-0">
                <motion.div
                  className="max-h-[70vh] overflow-y-auto"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="sticky top-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 backdrop-blur-md p-4 rounded-t-lg shadow-md z-10">
                    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
                      Current Preferences
                    </h2>
                  </div>
                  
                  <motion.div 
                    className="p-6 space-y-4"
                    variants={itemVariants}
                  >
                    {preferencesExist ? (
                      <>
                        <div className="bg-gray-900/50 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-700/40 hover:shadow-xl hover:bg-gray-900/70 transition-all duration-300">
                          <h3 className="font-semibold text-purple-300 mb-2">User Information</h3>
                          <p className="text-gray-200"><span className="text-gray-400">Name:</span> {preferences.name}</p>
                        </div>
                        
                        <div className="bg-gray-900/50 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-700/40 hover:shadow-xl hover:bg-gray-900/70 transition-all duration-300">
                          <h3 className="font-semibold text-purple-300 mb-2">Notification Settings</h3>
                          <p className="text-gray-200"><span className="text-gray-400">Email Notifications:</span> {preferences.emailNotifications ? '✅ Enabled' : '❌ Disabled'}</p>
                          <p className="text-gray-200"><span className="text-gray-400">Push Notifications:</span> {preferences.push ? '✅ Enabled' : '❌ Disabled'}</p>
                          <p className="text-gray-200"><span className="text-gray-400">Frequency:</span> {preferences.frequency.charAt(0).toUpperCase() + preferences.frequency.slice(1)}</p>
                          <p className="text-gray-200"><span className="text-gray-400">Time Zone:</span> {preferences.timeZone}</p>
                        </div>
                        
                        <div className="bg-gray-900/50 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-700/40 hover:shadow-xl hover:bg-gray-900/70 transition-all duration-300">
                          <h3 className="font-semibold text-purple-300 mb-2">Alert Thresholds</h3>
                          <p className="text-gray-200"><span className="text-gray-400">Low Stock Threshold:</span> {preferences.lowStockThreshold} items</p>
                          <p className="text-gray-200"><span className="text-gray-400">Expiry Threshold:</span> {preferences.expiryThresholdDays} days</p>
                        </div>
                        
                        <div className="mt-6">
                          <p className="text-gray-300 text-sm bg-blue-900/20 p-3 rounded-lg border border-blue-700/30">
                            These settings control when and how you receive notifications about your inventory. 
                            Adjust the thresholds to get timely alerts before items run out or expire.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-700/40 text-center">
                        <p className="text-gray-300 text-lg">No preferences set yet. Save your settings to get started!</p>
                        <p className="text-gray-400 mt-4">
                          Configure your notification preferences to receive timely alerts about low stock and expiring items.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
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
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NotificationSettings;