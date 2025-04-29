import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    frequency: 'daily',
    timeZone: 'UTC',
    lowStockThreshold: 10,
    expiryThresholdDays: 7,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/preferences/${userId}`);
      setPreferences(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Failed to load preferences.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (preferences.lowStockThreshold < 1 || preferences.expiryThresholdDays < 1) {
      setError('Threshold values must be at least 1.');
      return;
    }
    try {
      await axios.put(`http://localhost:7001/api/notifications/preferences/${userId}`, preferences);
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences.');
    }
  };

  // Animation variants for fade-in
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/portrait-satisfied-good-looking-female-red-dress-with-curly-hair-combed-bun_176420-24624.jpg?t=st=1742535095~exp=1742538695~hmac=a4306e4c134d6214435b55f399a8e8cd3ad347def355eada9ec02be9b33d35d3&w=996)`,
      }}
    >
      {/* Overlay for Readability */}
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

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 py-10">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Notification Settings
              </h1>
              <Link to="/notification-and-expiry-alerts" className="text-blue-600 hover:text-blue-900 text-1xl font-medium transition-colors">
                Back to Notification Home
              </Link>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg relative z-10">
              {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
              {success && <p className="text-green-600 mb-4 font-medium">Preferences saved successfully!</p>}
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700">Notification Channels</label>
                  <div className="mt-3 space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.email}
                        onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.push}
                        onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-700">Push</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">Frequency</label>
                  <select
                    value={preferences.frequency}
                    onChange={(e) => setPreferences({ ...preferences, frequency: e.target.value })}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="instant">Instant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">Time Zone</label>
                  <select
                    value={preferences.timeZone}
                    onChange={(e) => setPreferences({ ...preferences, timeZone: e.target.value })}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="PST">PST</option>
                    <option value="EST">EST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={preferences.lowStockThreshold}
                    onChange={(e) => setPreferences({ ...preferences, lowStockThreshold: Number(e.target.value) })}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">Expiry Threshold (Days)</label>
                  <input
                    type="number"
                    value={preferences.expiryThresholdDays}
                    onChange={(e) => setPreferences({ ...preferences, expiryThresholdDays: Number(e.target.value) })}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    placeholder="e.g., 7"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Save Settings
                </button>
              </form>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
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
            <p className="text-gray-400 text-xs md:text-sm">Powered by AT</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NotificationSettings;