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

// Predefined meal options for quick fill
const mealOptions = {
  Breakfast: [
    'Oatmeal with Berries',
    'Pancakes with Maple Syrup',
    'Avocado Toast',
    'Greek Yogurt with Honey',
  ],
  Lunch: [
    'Grilled Chicken Salad',
    'Turkey Sandwich',
    'Vegetable Stir-Fry',
    'Quinoa Bowl with Veggies',
  ],
  Dinner: [
    'Roasted Salmon with Potatoes',
    'Spaghetti Bolognese',
    'Grilled Steak with Veggies',
    'Vegetarian Lasagna',
  ],
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
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const response = await axios.get('http://localhost:7001/api/meal-plans');
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.weekStartDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayDate) {
      setError('Please select today or a future date for the week start date.');
      return;
    }

    try {
      let savedPlan;
      if (editingPlan) {
        const response = await axios.put(`http://localhost:7001/api/meal-plans/${editingPlan._id}`, formData);
        setMealPlans(mealPlans.map((plan) => (plan._id === editingPlan._id ? response.data : plan)));
        savedPlan = response.data;
        setEditingPlan(null);
      } else {
        const response = await axios.post('http://localhost:7001/api/meal-plans', formData);
        setMealPlans([...mealPlans, response.data]);
        savedPlan = response.data;
      }
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
      setError('');
      navigate(`/meal-plan-details/${savedPlan._id}`);
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError('Failed to save meal plan. Please try again.');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      weekStartDate: plan.weekStartDate.split('T')[0],
      meals: plan.meals,
    });
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7001/api/meal-plans/${id}`);
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
            {error && (
              <p className="text-red-500 mb-4 text-center">{error}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white mb-2">Week Start Date</label>
                <input
                  type="date"
                  value={formData.weekStartDate}
                  onChange={handleDateChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  required
                  min={today}
                />
              </div>
              {daysOfWeek.map((day) => (
                <div key={day} className="mb-4">
                  <h4 className="text-lg font-medium text-white capitalize mb-2">{day}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white mb-1">Breakfast</label>
                      <select
                        value={formData.meals[day].breakfast}
                        onChange={(e) => handleInputChange(day, 'breakfast', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                      >
                        <option value="">Select Breakfast</option>
                        {mealOptions.Breakfast.map((meal, index) => (
                          <option key={index} value={meal}>
                            {meal}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-1">Lunch</label>
                      <select
                        value={formData.meals[day].lunch}
                        onChange={(e) => handleInputChange(day, 'lunch', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                      >
                        <option value="">Select Lunch</option>
                        {mealOptions.Lunch.map((meal, index) => (
                          <option key={index} value={meal}>
                            {meal}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-1">Dinner</label>
                      <select
                        value={formData.meals[day].dinner}
                        onChange={(e) => handleInputChange(day, 'dinner', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                      >
                        <option value="">Select Dinner</option>
                        {mealOptions.Dinner.map((meal, index) => (
                          <option key={index} value={meal}>
                            {meal}
                          </option>
                        ))}
                      </select>
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
                      setError('');
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* List of Existing Meal Plans - Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <motion.div
                key={plan._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-teal-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-teal-300/30 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-teal-100 mb-4 text-center bg-teal-700/50 py-2 rounded-lg">
                  Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Monday - Wednesday */}
                  <div>
                    {daysOfWeek.slice(0, 3).map((day) => (
                      <div key={day} className="mb-3">
                        <h4 className="text-lg font-medium text-teal-200 capitalize bg-teal-600/30 py-1 px-2 rounded">{day}</h4>
                        <p className="text-blue-100 text-sm mt-1">
                          <span className="font-medium">B:</span> {plan.meals[day].breakfast || 'Not set'}
                        </p>
                        <p className="text-blue-100 text-sm">
                          <span className="font-medium">L:</span> {plan.meals[day].lunch || 'Not set'}
                        </p>
                        <p className="text-blue-100 text-sm">
                          <span className="font-medium">D:</span> {plan.meals[day].dinner || 'Not set'}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Right Column: Thursday - Sunday */}
                  <div>
                    {daysOfWeek.slice(3).map((day) => (
                      <div key={day} className="mb-3">
                        <h4 className="text-lg font-medium text-teal-200 capitalize bg-teal-600/30 py-1 px-2 rounded">{day}</h4>
                        <p className="text-blue-100 text-sm mt-1">
                          <span className="font-medium">B:</span> {plan.meals[day].breakfast || 'Not set'}
                        </p>
                        <p className="text-blue-100 text-sm">
                          <span className="font-medium">L:</span> {plan.meals[day].lunch || 'Not set'}
                        </p>
                        <p className="text-blue-100 text-sm">
                          <span className="font-medium">D:</span> {plan.meals[day].dinner || 'Not set'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all duration-300 shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
                  >
                    Delete
                  </button>
                  <NavLink
                    to={`/meal-plan-details/${plan._id}`}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-md"
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
        </div>
      </footer>
    </div>
  );
}