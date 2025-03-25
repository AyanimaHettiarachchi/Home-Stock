import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function NotificationHome() {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID (e.g., from auth)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/api/notifications/preferences/${userId}`);
        setUserName(response.data.name || 'User');
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
        setUserName('User');
      }
    };

    fetchUserData();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/unrecognizable-man-working-with-tablet_23-2147717389.jpg?t=st=1742824744~exp=1742828344~hmac=7115ae8a2e88ca5a0a9784d2b665e43cd903bc17eeeccb2ac6ba86c28c244f06&w=996)`,
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

        <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Notification & Expiry Alerts
            </h1>
            <p className="text-gray-100 text-lg sm:text-xl md:text-2xl mb-10 font-light leading-relaxed">
              Welcome, {userName}! Manage your alerts with ease and efficiency.
            </p>

            {error && (
              <motion.p
                className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/9840/9840777.png"
                    alt="Active Alerts Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Active Alerts
                    </h2>
                    <p className="text-gray-600 text-sm">View and manage active alerts</p>
                  </div>
                </div>
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </NavLink>

              <NavLink
                to="/notification-settings"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                    alt="Settings Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Settings
                    </h2>
                    <p className="text-gray-600 text-sm">Customize notification preferences</p>
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/notification-history"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/484/484364.png"
                    alt="History Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      History
                    </h2>
                    <p className="text-gray-600 text-sm">View past notifications</p>
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/user-message-form"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828939.png"
                    alt="Submit Feedback Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Submit Feedback {/* Updated button name */}
                    </h2>
                    <p className="text-gray-600 text-sm">Provide your feedback</p>
                  </div>
                </div>
              </NavLink>
            </div>
          </motion.div>
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

export default NotificationHome;