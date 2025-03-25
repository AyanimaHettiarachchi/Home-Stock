import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';

// Predefined meals for each meal type with basic ingredients
const mealOptions = {
  Breakfast: [
    { name: "Oatmeal with Berries", calories: 200, basicIngredients: ["oats", "berries", "milk", "honey"] },
    { name: "Pancakes with Maple Syrup", calories: 350, basicIngredients: ["flour", "eggs", "milk", "maple syrup"] },
    { name: "Avocado Toast", calories: 250, basicIngredients: ["bread", "avocado", "lemon", "salt"] },
    { name: "Greek Yogurt with Honey", calories: 180, basicIngredients: ["greek yogurt", "honey", "granola"] },
  ],
  Lunch: [
    { name: "Grilled Chicken Salad", calories: 400, basicIngredients: ["chicken breast", "lettuce", "tomatoes", "olive oil"] },
    { name: "Turkey Sandwich", calories: 350, basicIngredients: ["bread", "turkey", "lettuce", "mayo"] },
    { name: "Vegetable Stir-Fry", calories: 300, basicIngredients: ["mixed vegetables", "soy sauce", "garlic", "oil"] },
    { name: "Quinoa Bowl with Veggies", calories: 380, basicIngredients: ["quinoa", "mixed veggies", "lemon", "olive oil"] },
  ],
  Dinner: [
    { name: "Roasted Salmon with Potatoes", calories: 500, basicIngredients: ["salmon", "potatoes", "olive oil", "rosemary"] },
    { name: "Spaghetti Bolognese", calories: 600, basicIngredients: ["spaghetti", "ground beef", "tomato sauce", "onions"] },
    { name: "Grilled Steak with Veggies", calories: 550, basicIngredients: ["steak", "mixed veggies", "garlic", "butter"] },
    { name: "Vegetarian Lasagna", calories: 450, basicIngredients: ["lasagna noodles", "ricotta", "spinach", "tomato sauce"] },
  ],
  Snacks: [
    { name: "Apple Slices with Peanut Butter", calories: 200, basicIngredients: ["apple", "peanut butter"] },
    { name: "Mixed Nuts", calories: 180, basicIngredients: ["almonds", "cashews", "walnuts"] },
    { name: "Cheese and Crackers", calories: 220, basicIngredients: ["cheese", "crackers"] },
    { name: "Hummus with Carrots", calories: 150, basicIngredients: ["hummus", "carrots"] },
  ],
};

// Function to generate a 4-digit meal ID (e.g., 0001 to 9999)
const generateMealId = () => {
  const randomNum = Math.floor(Math.random() * 10000); // Generate a number between 0 and 9999
  return randomNum.toString().padStart(4, '0'); // Pad with leading zeros to ensure 4 digits
};

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [userNameError, setUserNameError] = useState("");
  const [formError, setFormError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const [newMeal, setNewMeal] = useState({
    mealId: generateMealId(),
    userName: "",
    email: "",
    mealName: "",
    mealType: "Breakfast",
    calories: "",
    ingredients: "",
    day: todayFormatted,
  });
  const [selectedMeal, setSelectedMeal] = useState("");
  const [extraIngredients, setExtraIngredients] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:7001/api/meals")
      .then((res) => {
        setMeals(res.data);
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
        setFormError("Failed to load meals. Please try again.");
      });
  }, []);

  // Validate user name (only letters and spaces allowed)
  const validateUserName = (value) => {
    const userNameRegex = /^[A-Za-z\s]*$/;
    if (!userNameRegex.test(value)) {
      setUserNameError("User Name can only contain letters and spaces.");
      return false;
    }
    setUserNameError("");
    return true;
  };

  // Validate meal ID (exactly 4 digits)
  const validateMealId = (value) => {
    const mealIdRegex = /^\d{4}$/; // Exactly 4 digits
    if (!mealIdRegex.test(value)) {
      setFormError("Meal ID must be exactly 4 digits (e.g., 0001).");
      return false;
    }
    return true;
  };

  // Handle user name input change
  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setNewMeal({ ...newMeal, userName: value });
    validateUserName(value);
  };

  // Handle meal type change
  const handleMealTypeChange = (e) => {
    const mealType = e.target.value;
    setNewMeal({ ...newMeal, mealType, mealName: "", calories: "", ingredients: "" });
    setSelectedMeal("");
    setExtraIngredients("");
  };

  // Handle meal selection from dropdown
  const handleMealSelection = (e) => {
    const selected = e.target.value;
    const mealData = mealOptions[newMeal.mealType].find((meal) => meal.name === selected);
    if (mealData) {
      setNewMeal({
        ...newMeal,
        mealName: mealData.name,
        calories: mealData.calories.toString(),
        ingredients: mealData.basicIngredients.join(", "),
      });
      setSelectedMeal(selected);
      setExtraIngredients("");
    }
  };

  const handleSaveMeal = async () => {
    if (!newMeal.mealName) {
      setFormError("Please select a meal.");
      return;
    }

    if (!validateUserName(newMeal.userName)) {
      return;
    }

    if (!validateMealId(newMeal.mealId)) {
      return;
    }

    const combinedIngredients = extraIngredients
      ? `${newMeal.ingredients}, ${extraIngredients}`
      : newMeal.ingredients;

    const mealToSave = {
      ...newMeal,
      ingredients: combinedIngredients,
      calories: Number(newMeal.calories),
      day: todayFormatted,
    };

    try {
      if (editingMeal) {
        const res = await axios.put(
          `http://localhost:7001/api/meals/${editingMeal._id}`,
          mealToSave
        );
        setMeals(meals.map((meal) => (meal._id === editingMeal._id ? res.data : meal)));
      } else {
        const res = await axios.post("http://localhost:7001/api/meals", mealToSave);
        setMeals([...meals, res.data]);
      }
      setShowForm(false);
      setNewMeal({
        mealId: generateMealId(),
        userName: "",
        email: "",
        mealName: "",
        mealType: "Breakfast",
        calories: "",
        ingredients: "",
        day: todayFormatted,
      });
      setSelectedMeal("");
      setExtraIngredients("");
      setUserNameError("");
      setFormError("");
      setEditingMeal(null);
    } catch (err) {
      console.error("Error saving meal:", err);
      setFormError(err.response?.data?.error || "Failed to save meal. Please try again.");
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`http://localhost:7001/api/meals/${id}`);
      setMeals(meals.filter((meal) => meal._id !== id));
      setFormError("");
    } catch (err) {
      console.error("Error deleting meal:", err);
      setFormError("Failed to delete meal. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/plate-with-keto-diet-food-cherry-tomatoes-chicken-breast-eggs-carrot-salad-with-arugula-spinach-keto-lunch-top-view_2829-16941.jpg?t=st=1742788090~exp=1742791690~hmac=18f70e556c07a30f80f1845d967ccb2167d37472863c49792750fc0a616a9b03&w=1380)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header */}
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
      <main className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Meal Planning</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingMeal(null);
              setNewMeal({
                ...newMeal,
                mealId: generateMealId(),
                userName: "",
                email: "",
                mealName: "",
                mealType: "Breakfast",
                calories: "",
                ingredients: "",
                day: todayFormatted,
              });
              setFormError("");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300 shadow-md"
          >
            + Add New Meal
          </button>
        </div>

        {/* Display form error if exists */}
        {formError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {formError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-4 text-left text-gray-700 font-semibold">Meal ID</th>
                <th className="p-4 text-left text-gray-700 font-semibold">User Name</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Email</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Meal Name</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Meal Type</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Calories</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Ingredients</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Date</th>
                <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4 text-gray-600">{meal.mealId || "N/A"}</td>
                  <td className="p-4 text-gray-600">{meal.userName || "N/A"}</td>
                  <td className="p-4 text-gray-600">{meal.email || "N/A"}</td>
                  <td className="p-4 text-gray-600">{meal.mealName}</td>
                  <td className="p-4 text-gray-600">{meal.mealType}</td>
                  <td className="p-4 text-gray-600">{meal.calories}</td>
                  <td className="p-4 text-gray-600">{meal.ingredients}</td>
                  <td className="p-4 text-gray-600">{meal.day}</td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setNewMeal(meal);
                        setEditingMeal(meal);
                        setSelectedMeal(meal.mealName);
                        const mealData = mealOptions[meal.mealType].find((m) => m.name === meal.mealName);
                        if (mealData) {
                          const basic = mealData.basicIngredients.join(", ");
                          const extra = meal.ingredients
                            .split(", ")
                            .filter((ing) => !mealData.basicIngredients.includes(ing))
                            .join(", ");
                          setExtraIngredients(extra);
                        } else {
                          setExtraIngredients(meal.ingredients);
                        }
                        setShowForm(true);
                        setFormError("");
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="text-red-500 ml-4 hover:text-red-700 transition-colors duration-300 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Modal with Increased Width */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div
              className="p-6 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-sm" // Changed max-w-md to max-w-lg
              style={{
                backgroundImage: `url('https://img.freepik.com/free-photo/couple-eating-salad-browsing-streaming-service-site_23-2147930585.jpg?t=st=1742719923~exp=1742723523~hmac=ac3e6578241d0ceb0c290a8be42f8c547f2cdcff7bd415efd137c60c32670e4d&w=740')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light overlay for readability
                backgroundBlendMode: 'overlay',
              }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                {editingMeal ? "Edit Meal" : "Add New Meal"}
              </h3>

              <div className="space-y-4">
                {/* Meal ID Field (Read-Only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal ID</label>
                  <input
                    type="text"
                    value={newMeal.mealId}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                  <input
                    type="text"
                    placeholder="User Name"
                    value={newMeal.userName}
                    onChange={handleUserNameChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      userNameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {userNameError && (
                    <p className="text-red-500 text-xs mt-1">{userNameError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newMeal.email}
                    onChange={(e) => setNewMeal({ ...newMeal, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select
                    value={newMeal.mealType}
                    onChange={handleMealTypeChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Meal</label>
                  <select
                    value={selectedMeal}
                    onChange={handleMealSelection}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select a meal...</option>
                    {mealOptions[newMeal.mealType].map((meal, index) => (
                      <option key={index} value={meal.name}>
                        {meal.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    placeholder="Calories"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Basic Ingredients</label>
                  <textarea
                    value={newMeal.ingredients}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 resize-none"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Ingredients</label>
                  <textarea
                    placeholder="Add extra ingredients (comma separated)"
                    value={extraIngredients}
                    onChange={(e) => setExtraIngredients(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newMeal.day}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setNewMeal({
                      mealId: generateMealId(),
                      userName: "",
                      email: "",
                      mealName: "",
                      mealType: "Breakfast",
                      calories: "",
                      ingredients: "",
                      day: todayFormatted,
                    });
                    setSelectedMeal("");
                    setExtraIngredients("");
                    setUserNameError("");
                    setFormError("");
                    setEditingMeal(null);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMeal}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors duration-300 shadow-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-gray-900/80 to-gray-900/80 backdrop-blur-md shadow-lg">
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