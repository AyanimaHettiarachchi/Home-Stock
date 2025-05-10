import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations

function Home() {
  // Animation variants for fade-in
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Animation variants for navigation links
  const navLinkVariants = {
    hover: { 
      scale: 1.1, 
      color: '#d1b3ff', 
      transition: { duration: 0.3, ease: 'easeOut' } 
    },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/girl-picking-something-eat-out-fridge_53876-144799.jpg?t=st=1742376257~exp=1742379857~hmac=a7b25e6989e87ee5fb06bc1e52ffa9affa046a7e9f832e78660efb0a60c9744f&w=900)`,
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/30"></div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/70 to-gray-900/70 backdrop-blur-lg shadow-xl border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <NavLink to="/">
                <motion.img
                  src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                  alt="Header Logo"
                  className="w-12 h-12 object-contain"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
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
                  `text-white text-sm md:text-lg transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Home
                </motion.span>
              </NavLink>
              <NavLink
                to="/notification-and-expiry-alerts"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Notifications
                </motion.span>
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Inventory
                </motion.span>
              </NavLink>
              <NavLink
                to="/meal-planning-dashboard"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Meal Planning
                </motion.span>
              </NavLink>
              <NavLink
                to="/notification-settings"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Settings
                </motion.span>
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Welcome to Home Stock
            </h1>
            <p className="text-gray-50 text-lg sm:text-xl md:text-2xl mb-10 font-light leading-relaxed drop-shadow-md">
              Organize your inventory, track expirations, and stay alerted with our intuitive management system.
            </p>
            <div className="flex justify-center space-x-4 md:space-x-6">
              <NavLink
                to="/notification-and-expiry-alerts"
                className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-semibold hover:from-black hover:to-blue-900 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Get Started
              </NavLink>
              <NavLink
                to="/notification-settings"
                className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-semibold hover:from-black hover:to-purple-900 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Configure Settings
              </NavLink>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-gradient-to-r from-gray-900/70 to-gray-900/70 backdrop-blur-lg shadow-xl border-t border-gray-700/30">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Footer Logo"
                className="w-10 h-10 object-contain"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <p className="text-white text-sm md:text-base drop-shadow-sm">© 2025 Home Stock. All rights reserved.</p>
            </div>
            <div className="flex justify-center space-x-4 md:space-x-6 mb-4">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-gray-300 text-sm md:text-base transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  About
                </motion.span>
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-gray-300 text-sm md:text-base transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Contact
                </motion.span>
              </NavLink>
              <NavLink
                to="/privacy-policy"
                className={({ isActive }) =>
                  `text-gray-300 text-sm md:text-base transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                <motion.span variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  Privacy Policy
                </motion.span>
              </NavLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;