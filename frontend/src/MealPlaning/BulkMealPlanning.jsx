import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
  const [inventory, setInventory] = useState([]);
  const [recentPlan, setRecentPlan] = useState(null);
  const userId = '507f1f77bcf86cd799439011';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchMealPlans();
    fetchInventory();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const response = await axios.get('http://localhost:7001/api/meal-plans');
      setMealPlans(response.data);
    } catch (err) {
      console.error('Error fetching meal plans:', err);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/inventory/${userId}`);
      setInventory(response.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to fetch inventory items.');
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
      setRecentPlan(savedPlan);
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
    setRecentPlan(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this meal plan?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:7001/api/meal-plans/${id}`);
      setMealPlans(mealPlans.filter((plan) => plan._id !== id));
      if (recentPlan && recentPlan._id === id) {
        setRecentPlan(null);
      }
      alert('Meal plan deleted successfully!');
    } catch (err) {
      console.error('Error deleting meal plan:', err);
      alert('Failed to delete meal plan');
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

          {/* Recent Meal Plan Details */}
          {recentPlan && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-gray-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-white">
                  Recent Meal Plan: Week of {new Date(recentPlan.weekStartDate).toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setRecentPlan(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  Clear
                </button>
              </div>
              {daysOfWeek.map((day) => (
                <div key={day} className="mb-4">
                  <h4 className="text-lg font-medium text-white capitalize mb-2">{day}</h4>
                  <p className="text-white">Breakfast: {recentPlan.meals[day].breakfast || 'Not set'}</p>
                  <p className="text-white">Lunch: {recentPlan.meals[day].lunch || 'Not set'}</p>
                  <p className="text-white">Dinner: {recentPlan.meals[day].dinner || 'Not set'}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Existing Meal Plans */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Existing Meal Plans</h3>
            {mealPlans.length === 0 ? (
              <p className="text-gray-200">No meal plans available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mealPlans.map((plan) => (
                  <motion.div
                    key={plan._id}
                    className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                  >
                    <h4 className="text-lg font-medium text-white">
                      Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                    </h4>
                    <p className="text-gray-200">
                      Meals Planned: {Object.values(plan.meals).flatMap(Object.values).filter(Boolean).length}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <NavLink
                        to={`/meal-plan-details/${plan._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                      >
                        View
                      </NavLink>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}