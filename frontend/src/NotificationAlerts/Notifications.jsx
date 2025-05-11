import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/${userId}`);
      console.log('Fetched notifications:', response.data); // Debug log
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please check the backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    if (!confirm('Are you sure you want to dismiss this notification?')) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`http://localhost:7001/api/notifications/${id}`);
      console.log('Dismiss response:', response.data); // Debug log
      await fetchNotifications(); // Refetch notifications to update the state
      setError(null);
    } catch (err) {
      console.error('Error dismissing notification:', err);
      setError('Failed to dismiss notification. Please try again.');
      await fetchNotifications(); // Refetch to recover from error
    }
  };

  console.log('Current notifications state:', notifications); // Debug log

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/premium-photo/woman-looking-phone-grocery-store_889227-27009.jpg)`,
        backgroundColor: '#1f2937',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative min-h-screen flex flex-col font-sans text-white" style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:text-black focus:p-2">
          Skip to main content
        </a>

        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/90 to-gray-900/90 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <NavLink to="/" aria-label="Home">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                  alt="Home Stock Logo"
                  className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </NavLink>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Home Stock
              </h1>
            </div>
            <nav className="flex flex-wrap gap-3 md:gap-6">
              {[
                { to: '/', label: 'Home' },
                { to: '/notification-and-expiry-alerts', label: 'Notifications' },
                { to: '/inventory', label: 'Inventory' },
                { to: '/meal-planning-dashboard', label: 'Meal Planning' },
                { to: '/notification-settings', label: 'Settings' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-white text-sm md:text-base hover:text-purple-300 transition-colors duration-300 ${
                      isActive ? 'underline underline-offset-4' : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 md:px-6 py-8">
          <motion.div className="max-w-6xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center">
                Active Alerts
              </h1>
              <Link
                to="/notification-and-expiry-alerts"
                className="mt-4 text-blue-400 hover:text-blue-600 text-base font-medium transition-colors flex items-center"
                aria-label="Back to Notification Home"
              >
                ← Back
              </Link>
            </div>
            <div className="bg-gray-800/95 backdrop-blur-lg p-6 rounded-xl shadow-xl relative z-10">
              {error && (
                <p
                  className="text-red-400 bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4 font-medium"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
              {isLoading && (
                <div className="flex justify-center mb-4">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              {!isLoading && notifications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">
                    No active notifications at the moment.
                  </p>
                </div>
              ) : (
                !isLoading && (
                  <div>
                    <p className="text-sm text-gray-400 mb-4">
                      Total Active Alerts: <span className="font-semibold">{notifications.length}</span>
                    </p>
                    <div className="max-h-[500px] overflow-y-auto pr-4">
                      <ul className="space-y-4">
                        {notifications.map((notif, index) => (
                          <motion.li
                            key={notif._id}
                            className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-md flex justify-between items-start hover:bg-gray-800 transition-colors"
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                          >
                            <div>
                              <h3 className="font-semibold text-gray-200 text-lg">
                                {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Alert
                              </h3>
                              <p className="text-gray-400 mt-2 leading-6">
                                {notif.message.length > 100
                                  ? `${notif.message.slice(0, 100)}...`
                                  : notif.message}
                              </p>
                              {notif.itemId && (
                                <p className="text-sm text-gray-500 mt-1">Item: {notif.itemId}</p>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                Created: {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleDismiss(notif._id)}
                                className="text-red-400 hover:text-red-300 font-medium focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded px-2 py-1"
                                aria-label={`Dismiss notification for item ${notif.itemId || notif._id}`}
                                disabled={isLoading}
                              >
                                Dismiss
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </main>

        <footer className="w-full bg-gradient-to-r from-gray-900/90 to-gray-900/90 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Home Stock Logo"
                className="w-8 h-8 object-contain hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <p className="text-gray-300 text-sm md:text-base">© 2025 Home Stock. All rights reserved.</p>
            </div>
            <div className="flex justify-center gap-4 md:gap-6">
              {[
                { href: '#about', label: 'About' },
                { href: '#contact', label: 'Contact' },
                { href: '#privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Notifications;