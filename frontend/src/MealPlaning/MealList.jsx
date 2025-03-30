// frontend/src/MealPlaning/MealList.jsx
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
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState(""); // Still needed for submission error
  const [extraIngredientsError, setExtraIngredientsError] = useState("");
  const [formError, setFormError] = useState("");

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
        setFilteredMeals(res.data);
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
        setFormError("Failed to load meals. Please try again.");
      });
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter((meal) =>
        (meal.userName || "").toLowerCase().includes(query)
      );
      setFilteredMeals(filtered);
    }
  };

  const generateReport = () => {
    if (!searchQuery || filteredMeals.length === 0) {
      setFormError("No meals found for the searched user name. Please search for a valid user.");
      return;
    }

    const userName = filteredMeals[0].userName;
    const totalCalories = filteredMeals.reduce((sum, meal) => sum + Number(meal.calories), 0);
    const averageCalories = filteredMeals.length > 0 ? (totalCalories / filteredMeals.length).toFixed(1) : 0;

    const calorieRanges = {
      "0-200": 0,
      "201-400": 0,
      "401-600": 0,
      "601-800": 0,
      "801+": 0,
    };

    filteredMeals.forEach((meal) => {
      const calories = Number(meal.calories);
      if (calories <= 200) calorieRanges["0-200"]++;
      else if (calories <= 400) calorieRanges["201-400"]++;
      else if (calories <= 600) calorieRanges["401-600"]++;
      else if (calories <= 800) calorieRanges["601-800"]++;
      else calorieRanges["801+"]++;
    });

    const tableRows = filteredMeals.map((meal) => `
      <tr>
        <td>${meal.mealId || "N/A"}</td>
        <td>${meal.userName || "N/A"}</td>
        <td>${meal.email || "N/A"}</td>
        <td>${meal.mealName}</td>
        <td>${meal.mealType}</td>
        <td>${meal.calories}</td>
        <td>${meal.ingredients.replace(/, /g, '<br>')}</td>
        <td>${meal.day}</td>
      </tr>
    `).join("");

    const now = new Date();
    const generatedOn = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString()}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meal Report for ${userName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .header h2 {
            font-size: 18px;
            margin: 5px 0;
          }
          .summary {
            margin-bottom: 20px;
          }
          .summary h4 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .summary p {
            font-size: 14px;
            margin: 5px 0;
          }
          .meal-entries h4 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .footer {
            text-align: left;
            font-size: 12px;
            color: #555;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            position: fixed;
            bottom: 20px;
            width: 760px;
          }
          .footer img {
            width: 30px;
            height: 30px;
            vertical-align: middle;
            margin-right: 5px;
          }
          .footer .right {
            float: right;
          }
          @media print {
            .footer {
              position: fixed;
              bottom: 0;
            }
          }
        </style>
      </head>
      <body onload="window.print()">
        <div class="container">
          <div class="header">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png" alt="Home Stock Logo">
            <div>
              <h1>Home Stock</h1>
              <h2>Meal Report</h2>
            </div>
          </div>

          <div class="summary">
            <h4>Summary</h4>
            <p>Total Meals: ${filteredMeals.length}</p>
            <p>Average Calories: ${averageCalories}</p>
            <p>Calories Breakdown:</p>
            <p>0-200: ${calorieRanges["0-200"]}</p>
            <p>201-400: ${calorieRanges["201-400"]}</p>
            <p>401-600: ${calorieRanges["401-600"]}</p>
            <p>601-800: ${calorieRanges["601-800"]}</p>
            <p>801+: ${calorieRanges["801+"]}</p>
          </div>

          <div class="meal-entries">
            <h4>All Meal Entries</h4>
            <table>
              <thead>
                <tr>
                  <th>Meal ID</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Meal Name</th>
                  <th>Meal Type</th>
                  <th>Calories</th>
                  <th>Ingredients</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p><img src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png" alt="Home Stock Logo"> Home Stock</p>
            <p>Address: 64/ Main Street, Colombo - 10</p>
            <p>Phone: +94 (70) 5346902 | Email: support@homestock.com</p>
            <p>Website: www.homestock.com</p>
            <p>Generated On: ${generatedOn}</p>
            <p class="right">Page 1 of 1</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();

    setFormError("");
  };

  const validateUserName = (value) => {
    const userNameRegex = /^[A-Za-z\s]*$/;
    if (!userNameRegex.test(value)) {
      setUserNameError("User Name can only contain letters and spaces.");
      return false;
    }
    setUserNameError("");
    return true;
  };

  const validateMealId = (value) => {
    const mealIdRegex = /^\d{4}$/;
    if (!mealIdRegex.test(value)) {
      setFormError("Meal ID must be exactly 4 digits (e.g., 0001).");
      return false;
    }
    return true;
  };

  // Modified validateEmail to only return boolean, no error setting
  const validateEmail = (value) => {
    return value.includes('@');
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setNewMeal({ ...newMeal, userName: value });
    validateUserName(value);
  };

  // Modified handleEmailChange to not trigger validation or set error
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewMeal({ ...newMeal, email: value });
    setEmailError(""); // Clear error while typing
  };

  const handleExtraIngredientsChange = (e) => {
    const value = e.target.value;
    setExtraIngredients(value);
    validateExtraIngredients(value);
  };

  const handleMealTypeChange = (e) => {
    const mealType = e.target.value;
    setNewMeal({ ...newMeal, mealType, mealName: "", calories: "", ingredients: "" });
    setSelectedMeal("");
    setExtraIngredients("");
    setExtraIngredientsError("");
  };

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
      setExtraIngredientsError("");
    }
  };

  // Updated handleSaveMeal to set email error only on submission
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

    if (!validateEmail(newMeal.email)) {
      setEmailError("Email must contain an @ symbol.");
      return;
    }

    if (!validateExtraIngredients(extraIngredients)) {
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
        const updatedMeals = meals.map((meal) => (meal._id === editingMeal._id ? res.data : meal));
        setMeals(updatedMeals);
        setFilteredMeals(updatedMeals);
      } else {
        const res = await axios.post("http://localhost:7001/api/meals", mealToSave);
        const updatedMeals = [...meals, res.data];
        setMeals(updatedMeals);
        setFilteredMeals(updatedMeals);
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
      setEmailError(""); // Clear email error after successful save
      setExtraIngredientsError("");
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
      const updatedMeals = meals.filter((meal) => meal._id !== id);
      setMeals(updatedMeals);
      setFilteredMeals(updatedMeals);
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
                `text-white text-sm md:text-lg hover:text-purple-300 transition-Colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
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
              setEmailError("");
              setExtraIngredientsError("");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300 shadow-md"
          >
            + Add New Meal
          </button>
        </div>

        {/* Search Bar and Generate Report Button */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search meals by user name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={generateReport}
            disabled={!searchQuery || filteredMeals.length === 0}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-md ${
              !searchQuery || filteredMeals.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Generate Report
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
              {filteredMeals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-600">
                    No meals found.
                  </td>
                </tr>
              ) : (
                filteredMeals.map((meal) => (
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
                          setEmailError("");
                          setExtraIngredientsError("");
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Form Modal with Increased Width */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div
              className="p-6 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-sm"
              style={{
                backgroundImage: `url('https://img.freepik.com/free-photo/couple-eating-salad-browsing-streaming-service-site_23-2147930585.jpg?t=st=1742719923~exp=1742723523~hmac=ac3e6578241d0ceb0c290a8be42f8c547f2cdcff7bd415efd137c60c32670e4d&w=740')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backgroundBlendMode: 'overlay',
              }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                {editingMeal ? "Edit Meal" : "Add New Meal"}
              </h3>

              <div className="space-y-4">
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
                    onChange={handleEmailChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
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
                    onChange={handleExtraIngredientsChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      extraIngredientsError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                    rows="2"
                  />
                  {extraIngredientsError && (
                    <p className="text-red-500 text-xs mt-1">{extraIngredientsError}</p>
                  )}
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
                    setEmailError("");
                    setExtraIngredientsError("");
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
        </div>
      </footer>
    </div>
  );
}