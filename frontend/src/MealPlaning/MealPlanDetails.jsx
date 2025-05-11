import { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Animation variants for fade-in
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Predefined meal options for quick fill (from BulkMealPlanning.jsx)
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

export default function MealPlanDetails() {
  const { id } = useParams(); // Get the meal plan ID from the URL
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [inventory, setInventory] = useState([]);
  const userId = '507f1f77bcf86cd799439011';

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const fetchMealPlan = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/meal-plans/${id}`);
      setMealPlan(response.data);
      setFormData({
        weekStartDate: response.data.weekStartDate.split('T')[0],
        meals: response.data.meals,
      });
      setLoading(false);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Meal plan not found');
        navigate('/bulk-meal-planning'); // Redirect if plan is deleted
      } else {
        setError('Error fetching meal plan details');
      }
      setLoading(false);
      console.error('Error fetching meal plan:', err);
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

  useEffect(() => {
    fetchMealPlan();
    fetchInventory();

    // Optional polling to refresh data every 30 seconds
    const interval = setInterval(fetchMealPlan, 30000);
    return () => clearInterval(interval);
  }, [id]);

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
    setUpdateError('');
    setSuccessMessage('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.weekStartDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayDate) {
      setUpdateError('Please select today or a future date for the week start date.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:7001/api/meal-plans/${id}`, formData);
      setMealPlan(response.data);
      setIsEditing(false);
      setUpdateError('');
      setSuccessMessage('Meal plan updated successfully!');
      toast.success('Meal plan updated successfully!', {
        position: 'top-center',
        autoClose: 3000,
        className: 'bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-500 shadow-lg',
      });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating meal plan:', err);
      setUpdateError('Failed to update meal plan');
      toast.error('Failed to update meal plan', {
        position: 'top-center',
        autoClose: 3000,
        className: 'bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-500 shadow-lg',
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await axios.delete(`http://localhost:7001/api/meal-plans/${id}`);
        navigate('/bulk-meal-planning');
        toast.success('Meal plan deleted successfully!', {
          position: 'top-center',
          autoClose: 3000,
          className: 'bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-500 shadow-lg',
        });
      } catch (err) {
        console.error('Error deleting meal plan:', err);
        setError('Failed to delete meal plan');
        toast.error('Failed to delete meal plan', {
          position: 'top-center',
          autoClose: 3000,
          className: 'bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-500 shadow-lg',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {error || 'Meal plan not found'}
      </div>
    );
  }

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
            Meal Plan Details
          </h2>
          <p className="text-gray-200 text-lg md:text-xl mb-10 text-center drop-shadow-md">
            Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}
          </p>

          {/* Meal Plan Details */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
          >
            {isEditing ? (
              <form onSubmit={handleUpdate}>
                {updateError && (
                  <p className="text-red-500 mb-4 text-center">{updateError}</p>
                )}
                {successMessage && (
                  <p className="text-green-500 mb-4 text-center">{successMessage}</p>
                )}
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
                          className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
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
                          className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
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
                          className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
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
                    Update Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setUpdateError('');
                      setSuccessMessage('');
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {daysOfWeek.map((day) => (
                  <div key={day} className="mb-4">
                    <h4 className="text-lg font-medium text-white capitalize mb-2">{day}</h4>
                    <p className="text-white">Breakfast: {mealPlan.meals[day].breakfast || 'Not set'}</p>
                    <p className="text-white">Lunch: {mealPlan.meals[day].lunch || 'Not set'}</p>
                    <p className="text-white">Dinner: {mealPlan.meals[day].dinner || 'Not set'}</p>
                  </div>
                ))}
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                  <NavLink
                    to="/bulk-meal-planning"
                    className="bg-gradient-to-r from-blue-900 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-blue-950 hover:to-blue-500 transition-all duration-300"
                  >
                    Back to Plans
                  </NavLink>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </main>

      <ToastContainer />
    </div>
  );
}