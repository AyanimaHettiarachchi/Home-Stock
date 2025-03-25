// frontend/src/MealPlaning/BulkMealPlanning.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation variants for fade-in
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function BulkMealPlanning() {
  const [mealPlans, setMealPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weekStartDate: '',
    meals: {
      monday: { breakfast: '', lunch: '', dinner: '' },
      tuesday: { breakfast: '', lunch: '', dinner: '' },
      wednesday: { breakfast: '', lunch: '', dinner: '' },
      thursday: { breakfast: '', lunch: '', dinner: '' },
      friday: { breakfast: '', lunch: '', dinner: '' },
      saturday: { breakfast: '', lunch: '', dinner: '' },
      sunday: { breakfast: '', lunch: '', dinner: '' },
    },
  });

  // Fetch all meal plans on component mount
  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/meal-plans');
      setMealPlans(response.data);
    } catch (err) {
      console.error('Error fetching meal plans:', err);
    }
  };

  const handleInputChange = (day, mealType, value) => {
    setFormData((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [day]: {
          ...prev.meals[day],
          [mealType]: value,
        },
      },
    }));
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      weekStartDate: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedPlan;
      if (editingPlan) {
        // Update existing meal plan
        const response = await axios.put(`http://localhost:5000/api/meal-plans/${editingPlan._id}`, formData);
        setMealPlans(mealPlans.map((plan) => (plan._id === editingPlan._id ? response.data : plan)));
        savedPlan = response.data;
        setEditingPlan(null);
      } else {
        // Create new meal plan
        const response = await axios.post('http://localhost:5000/api/meal-plans', formData);
        setMealPlans([...mealPlans, response.data]);
        savedPlan = response.data;
      }
      // Reset form
      setFormData({
        weekStartDate: '',
        meals: {
          monday: { breakfast: '', lunch: '', dinner: '' },
          tuesday: { breakfast: '', lunch: '', dinner: '' },
          wednesday: { breakfast: '', lunch: '', dinner: '' },
          thursday: { breakfast: '', lunch: '', dinner: '' },
          friday: { breakfast: '', lunch: '', dinner: '' },
          saturday: { breakfast: '', lunch: '', dinner: '' },
          sunday: { breakfast: '', lunch: '', dinner: '' },
        },
      });
      // Navigate to the details page with the saved meal plan's ID
      navigate(`/meal-plan-details/${savedPlan._id}`);
    } catch (err) {
      console.error('Error saving meal plan:', err);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      weekStartDate: plan.weekStartDate.split('T')[0], // Format date for input
      meals: plan.meals,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/meal-plans/${id}`);
      setMealPlans(mealPlans.filter((plan) => plan._id !== id));
    } catch (err) {
      console.error('Error deleting meal plan:', err);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/top-view-assortment-food-with-planner_23-2148484699.jpg?t=st=1742785105~exp=1742788705~hmac=8bf33891bfb6a071af0a400f727db1fd7e7d928a936f6edb81965aa91c4eb4ea&w=1380')`,
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
            Bulk Meal Planning
          </h2>
          <p className="text-gray-200 text-lg md:text-xl mb-10 text-center drop-shadow-md">
            Plan your meals for the week ahead
          </p>

          {/* Form for Creating/Updating Meal Plans */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              {editingPlan ? 'Edit Meal Plan' : 'Create a New Meal Plan'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white mb-2">Week Start Date</label>
                <input
                  type="date"
                  value={formData.weekStartDate}
                  onChange={handleDateChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>
              {daysOfWeek.map((day) => (
                <div key={day} className="mb-4">
                  <h4 className="text-lg font-medium text-white capitalize mb-2">{day}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white mb-1">Breakfast</label>
                      <input
                        type="text"
                        value={formData.meals[day].breakfast}
                        onChange={(e) => handleInputChange(day, 'breakfast', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        placeholder="e.g., Oatmeal with Berries"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Lunch</label>
                      <input
                        type="text"
                        value={formData.meals[day].lunch}
                        onChange={(e) => handleInputChange(day, 'lunch', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        placeholder="e.g., Grilled Chicken Salad"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Dinner</label>
                      <input
                        type="text"
                        value={formData.meals[day].dinner}
                        onChange={(e) => handleInputChange(day, 'dinner', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        placeholder="e.g., Spaghetti Bolognese"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-900 to-blue-400 text-white px-6 py-3 rounded-full text-lg font-medium hover:from-blue-950 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {editingPlan ? 'Update Plan' : 'Save Plan'}
                </button>
                {editingPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlan(null);
                      setFormData({
                        weekStartDate: '',
                        meals: {
                          monday: { breakfast: '', lunch: '', dinner: '' },
                          tuesday: { breakfast: '', lunch: '', dinner: '' },
                          wednesday: { breakfast: '', lunch: '', dinner: '' },
                          thursday: { breakfast: '', lunch: '', dinner: '' },
                          friday: { breakfast: '', lunch: '', dinner: '' },
                          saturday: { breakfast: '', lunch: '', dinner: '' },
                          sunday: { breakfast: '', lunch: '', dinner: '' },
                        },
                      });
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* List of Existing Meal Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <motion.div
                key={plan._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                </h3>
                {daysOfWeek.map((day) => (
                  <div key={day} className="mb-4">
                    <h4 className="text-lg font-medium text-white capitalize">{day}</h4>
                    <p className="text-white">Breakfast: {plan.meals[day].breakfast || 'Not set'}</p>
                    <p className="text-white">Lunch: {plan.meals[day].lunch || 'Not set'}</p>
                    <p className="text-white">Dinner: {plan.meals[day].dinner || 'Not set'}</p>
                  </div>
                ))}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                  <NavLink
                    to={`/meal-plan-details/${plan._id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                  >
                    View Details
                  </NavLink>
                </div>
              </motion.div>
            ))}
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
          <p className="text-gray-400 text-xs md:text-sm">Powered by xAI</p>
        </div>
      </footer>
    </div>
  );
}
