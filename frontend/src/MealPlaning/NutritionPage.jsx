import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants for fade-in
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function NutritionPage() {
  // Sample nutritional data for different food categories
  const nutritionData = {
    vegetables: [
      { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.1 },
      { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
      { name: 'Carrot', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 },
    ],
    fruits: [
      { name: 'Apple', calories: 95, protein: 0.5, carbs: 25.1, fat: 0.3, fiber: 4.4 },
      { name: 'Banana', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
      { name: 'Orange', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1 },
    ],
    meatItems: [
      { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      { name: 'Beef (Lean)', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
      { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
    ],
    dairyItems: [
      { name: 'Milk (Whole)', calories: 149, protein: 7.7, carbs: 11.7, fat: 8, fiber: 0 },
      { name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 3.6, fat: 5, fiber: 0 },
      { name: 'Cheddar Cheese', calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
    ],
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/healthy-food-medical-equipment_23-2148108966.jpg?t=st=1742823765~exp=1742827365~hmac=2b9682ba081e7bd30ce7ffe863332b9e77533673e03d61539efd3e8f7055acb2&w=1380')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header */}
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
              to="/meal-planning-dashboard"
              className={({ isActive }) =>
                `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Meal Planning
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
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-8 text-center">
            Nutrition Information
          </h2>
          <p className="text-gray-200 text-lg md:text-xl mb-10 text-center drop-shadow-md">
            Explore the nutritional values of various food categories
          </p>

          {/* Nutrition Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vegetables */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-green-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Vegetables</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4">Food</th>
                      <th className="py-2 px-4">Calories (kcal)</th>
                      <th className="py-2 px-4">Protein (g)</th>
                      <th className="py-2 px-4">Carbs (g)</th>
                      <th className="py-2 px-4">Fat (g)</th>
                      <th className="py-2 px-4">Fiber (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.vegetables.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.calories}</td>
                        <td className="py-2 px-4">{item.protein}</td>
                        <td className="py-2 px-4">{item.carbs}</td>
                        <td className="py-2 px-4">{item.fat}</td>
                        <td className="py-2 px-4">{item.fiber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Fruits */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-orange-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Fruits</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4">Food</th>
                      <th className="py-2 px-4">Calories (kcal)</th>
                      <th className="py-2 px-4">Protein (g)</th>
                      <th className="py-2 px-4">Carbs (g)</th>
                      <th className="py-2 px-4">Fat (g)</th>
                      <th className="py-2 px-4">Fiber (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.fruits.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.calories}</td>
                        <td className="py-2 px-4">{item.protein}</td>
                        <td className="py-2 px-4">{item.carbs}</td>
                        <td className="py-2 px-4">{item.fat}</td>
                        <td className="py-2 px-4">{item.fiber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Meat Items */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-red-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Meat Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4">Food</th>
                      <th className="py-2 px-4">Calories (kcal)</th>
                      <th className="py-2 px-4">Protein (g)</th>
                      <th className="py-2 px-4">Carbs (g)</th>
                      <th className="py-2 px-4">Fat (g)</th>
                      <th className="py-2 px-4">Fiber (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.meatItems.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.calories}</td>
                        <td className="py-2 px-4">{item.protein}</td>
                        <td className="py-2 px-4">{item.carbs}</td>
                        <td className="py-2 px-4">{item.fat}</td>
                        <td className="py-2 px-4">{item.fiber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Dairy Item */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-blue-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Dairy Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-2 px-4">Food</th>
                      <th className="py-2 px-4">Calories (kcal)</th>
                      <th className="py-2 px-4">Protein (g)</th>
                      <th className="py-2 px-4">Carbs (g)</th>
                      <th className="py-2 px-4">Fat (g)</th>
                      <th className="py-2 px-4">Fiber (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.dairyItems.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.calories}</td>
                        <td className="py-2 px-4">{item.protein}</td>
                        <td className="py-2 px-4">{item.carbs}</td>
                        <td className="py-2 px-4">{item.fat}</td>
                        <td className="py-2 px-4">{item.fiber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
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