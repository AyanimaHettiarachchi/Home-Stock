import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons for each card (unchanged)
const DailyMealIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const BulkMealIcon = () => (
  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
  </svg>
);

const NutritionIcon = () => (
  <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);


const RecipesIcon = () => (
  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path>
  </svg>
);

export default function MealPlanningDashboard() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    hover: { y: -10, transition: { duration: 0.3 } }, // Slide-up effect on hover
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/top-view-charts-organic-food-lunch-boxes_23-2148515965.jpg?t=st=1742826643~exp=1742830243~hmac=a24c75b8db0ead06044d4c2fe3dc979a9e64d59b8244e93a7466aceaae344ccd&w=1380')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header (unchanged) */}
      <header className="sticky top-0 z-50 w-full bg-gray-900/30 backdrop-blur-md shadow-lg">
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
            <NavLink to="/" className={({ isActive }) => `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/notification-and-expiry-alerts" className={({ isActive }) => `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`}>
              Notifications
            </NavLink>
            <NavLink to="/meal-planning-dashboard" className={({ isActive }) => `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`}>
              Meal Planning
            </NavLink>
            <NavLink to="/notification-settings" className={({ isActive }) => `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`}>
              Settings
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-10">
        <motion.div className="max-w-6xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-8 text-center">
            Meal Planning Dashboard
          </h2>
          <p className="text-gray-200 text-lg md:text-xl mb-14 text-center drop-shadow-md">
            Plan your meals, track nutrition, and discover recipes with ease
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Daily Meal Planning Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center min-h-80 border border-gray-200 overflow-hidden"
            >
              <DailyMealIcon />
              <h3 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Daily Meal Planning</h3>
              <p className="text-gray-600 text-base mb-4">
                Plan your meals for each day with a simple and intuitive interface.
              </p>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Daily Meal"
                className="mt-4 w-full h-40 object-cover rounded-lg"
              />
              <Link
                to="/MealList"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-medium hover:from-blue-700 hover:to-blue-500 transition-all duration-300 mt-4 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Bulk Meal Planning Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center min-h-80 border border-gray-200 overflow-hidden"
            >
              <BulkMealIcon />
              <h3 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Bulk Meal Planning</h3>
              <p className="text-gray-600 text-base mb-4">
                Plan multiple meals at once for the week or month ahead.
              </p>
              <img
                src="https://img.freepik.com/free-photo/top-view-assortment-food-with-planner_23-2148484699.jpg?t=st=1742785105~exp=1742788705~hmac=8bf33891bfb6a071af0a400f727db1fd7e7d928a936f6edb81965aa91c4eb4ea&w=1380"
                alt="Bulk Meal"
                className="mt-4 w-full h-40 object-cover rounded-lg"
              />
              <Link
                to="/bulk-meal-planning"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-medium hover:from-blue-700 hover:to-blue-500 transition-all duration-300 mt-4 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Nutrition Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center min-h-80 border border-gray-200 overflow-hidden"
            >
              <NutritionIcon />
              <h3 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Nutrition</h3>
              <p className="text-gray-600 text-base mb-4">
                Track the nutritional value of your meals and stay healthy.
              </p>
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Nutrition"
                className="mt-4 w-full h-40 object-cover rounded-lg"
              />
              <Link
                to="/nutrition"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-medium hover:from-blue-700 hover:to-blue-500 transition-all duration-300 mt-4 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Recipes Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center min-h-80 border border-gray-200 overflow-hidden"
            >
              <RecipesIcon />
              <h3 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Recipes</h3>
              <p className="text-gray-600 text-base mb-4">
                Discover healthy and delicious recipes tailored to your diet.
              </p>
              <img
                src="https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Recipes"
                className="mt-4 w-full h-40 object-cover rounded-lg"
              />
              <Link
                to="/recipes"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-medium hover:from-blue-700 hover:to-blue-500 transition-all duration-300 mt-4 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer (unchanged) */}
      <footer className="w-full bg-gray-900/30 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
              alt="Footer Logo"
              className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
            />
            <p className="text-white text-sm md:text-base">© 2025 Home Stock Manager. All rights reserved.</p>
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
  );
}