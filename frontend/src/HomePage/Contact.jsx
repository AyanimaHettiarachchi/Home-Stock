import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Contact() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/girl-picking-something-eat-out-fridge_53876-144799.jpg?t=st=1742376257~exp=1742379857~hmac=a7b25e6989e87ee5fb06bc1e52ffa9affa046a7e9f832e78660efb0a60c9744f&w=900)`,
      }}
    >
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
        <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-10">
          <motion.div
            className="text-center max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-white/20"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-purple-600 to-pink-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] mb-6">
              Contact Us
            </h1>
            <p className="text-gray-100 text-lg sm:text-xl md:text-2xl mb-6 font-light leading-relaxed drop-shadow-md">
              Have questions or need support? We're here to help!
            </p>
            <div className="text-gray-300 text-base sm:text-lg md:text-xl mb-10 font-light leading-relaxed drop-shadow-md">
              <p>Email: <a href="mailto:support@homestock.com" className="text-blue-400 hover:text-blue-300 transition-colors">support@homestock.com</a></p>
              <p>Phone: <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 transition-colors">+94 (70)5346902</a></p>
              <p>Address: 64/ Main Street , colombo - 10</p>
            </div>
            <NavLink
              to="/"
              className="bg-gradient-to-r from-black to-purple-900 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Back to Home
            </NavLink>
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
                  `text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                Contact
              </NavLink>
              <NavLink
                to="/privacy-policy"
                className={({ isActive }) =>
                  `text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
                }
              >
                Privacy Policy
              </NavLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Contact;