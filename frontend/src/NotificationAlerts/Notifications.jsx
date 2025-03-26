import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/${userId}`);
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Check backend.');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.delete(`http://localhost:7001/api/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error dismissing notification:', err);
      setError('Failed to dismiss notification.');
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
        backgroundImage: `url(https://img.freepik.com/premium-photo/woman-looking-phone-grocery-store_889227-27009.jpg)`,
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
                Active Alerts
              </h1>
              <Link to="/notification-and-expiry-alerts" className="text-blue-200 hover:text-blue-400 text-lg font-medium transition-colors">
                Back to Notification Home
              </Link>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg relative z-10">
              {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No active notifications at the moment.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Total Active Alerts: <span className="font-semibold">{notifications.length}</span></p>
                  <ul className="space-y-4">
                    {notifications.map((notif) => (
                      <li key={notif._id} className="border border-gray-200 p-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Alert</h3>
                            <p className="text-gray-700 mt-2">{notif.message}</p>
                            <p className="text-sm text-gray-500 mt-1">Item ID: {notif.itemId}</p>
                            <p className="text-sm text-gray-500 mt-1">Created: {new Date(notif.createdAt).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleDismiss(notif._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Notifications;