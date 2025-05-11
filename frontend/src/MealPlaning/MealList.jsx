import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import jsPDF from 'jspdf';

const mealOptions = {
  Breakfast: [
    { 
      name: "Strawberry Yogurt Parfait", 
      calories: 220, 
      basicIngredients: ["yogurt", "strawberries", "apples", "dairy milk"] 
    },
    { 
      name: "Scrambled Eggs with Cheese", 
      calories: 240, 
      basicIngredients: ["eggs", "cheese", "butter", "cucumber"] 
    },
  ],
  Lunch: [
    { 
      name: "Chicken Drumstick Salad", 
      calories: 350, 
      basicIngredients: ["chicken drumsticks", "cucumber", "yogurt", "soya sauce", "cheese"] 
    },
    { 
      name: "Pizza Slice Melt with Apple Side", 
      calories: 400, 
      basicIngredients: ["pizza slices", "cheese", "apples", "fruit juice"] 
    },
  ],
  Dinner: [
    { 
      name: "Tofu Stir-Fry with Soya Sauce", 
      calories: 300, 
      basicIngredients: ["tofu", "cucumber", "soya sauce", "butter", "eggs"] 
    },
    { 
      name: "Baked Chicken Drumsticks with Strawberry Sauce", 
      calories: 450, 
      basicIngredients: ["chicken drumsticks", "butter", "strawberries", "yogurt", "cheese"] 
    },
  ],
  Snacks: [
    { 
      name: "Apple and Cheese Bites", 
      calories: 180, 
      basicIngredients: ["apples", "cheese", "dairy milk"] 
    },
    { 
      name: "Ice Cream and Strawberry Sundae", 
      calories: 250, 
      basicIngredients: ["ice cream", "strawberries", "dairy milk", "yogurt"] 
    },
  ],
};

const generateMealId = () => {
  const randomNum = Math.floor(Math.random() * 10000);
  return randomNum.toString().padStart(4, '0');
};

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [extraIngredientsError, setExtraIngredientsError] = useState("");
  const [formError, setFormError] = useState("");
  const [inventory, setInventory] = useState([]);
  const userId = '507f1f77bcf86cd799439011';

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

    axios
      .get(`http://localhost:7001/api/inventory/${userId}`)
      .then((res) => {
        setInventory(res.data);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        setFormError("Failed to fetch inventory items.");
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
    const doc = new jsPDF();

    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Home Stock", 20, 20);

    const logoUrl = 'https://cdn-icons-png.flaticon.com/512/5968/5968817.png';
    doc.addImage(logoUrl, 'PNG', 60, 10, 20, 20);

    doc.setFontSize(16);
    doc.text("Meal Report", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated for: ${userName}`, 20, 50);
    doc.text(`Date: ${todayFormatted}`, 20, 58);

    const tableWidth = 170;
    const pageWidth = 210;
    const margin = (pageWidth - tableWidth) / 2;
    const tableStartX = margin;
    const tableStartY = 70;

    const colWidths = {
      mealId: 25,
      userName: 40,
      mealName: 55,
      date: 50,
    };

    doc.setFillColor(240, 240, 240);
    doc.rect(tableStartX, tableStartY, tableWidth, 10, "F");
    doc.setFontSize(11);
    doc.setTextColor(33, 150, 243);
    doc.setFont("helvetica", "bold");

    let xPos = tableStartX;
    doc.rect(xPos, tableStartY, colWidths.mealId, 10);
    doc.text("Meal ID", xPos + 2, tableStartY + 7);
    xPos += colWidths.mealId;
    doc.rect(xPos, tableStartY, colWidths.userName, 10);
    doc.text("User Name", xPos + 2, tableStartY + 7);
    xPos += colWidths.userName;
    doc.rect(xPos, tableStartY, colWidths.mealName, 10);
    doc.text("Meal Name", xPos + 2, tableStartY + 7);
    xPos += colWidths.mealName;
    doc.rect(xPos, tableStartY, colWidths.date, 10);
    doc.text("Date", xPos + 2, tableStartY + 7);

    let yPos = tableStartY + 10;
    const rowHeight = 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    filteredMeals.forEach((meal, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(tableStartX, yPos, tableWidth, rowHeight, "F");
      }

      xPos = tableStartX;
      doc.rect(xPos, yPos, colWidths.mealId, rowHeight);
      doc.text(meal.mealId || "N/A", xPos + 2, yPos + 7);
      xPos += colWidths.mealId;
      doc.rect(xPos, yPos, colWidths.userName, rowHeight);
      doc.text((meal.userName || "N/A").substring(0, 20), xPos + 2, yPos + 7);
      xPos += colWidths.userName;
      doc.rect(xPos, yPos, colWidths.mealName, rowHeight);
      doc.text(meal.mealName.substring(0, 30), xPos + 2, yPos + 7);
      xPos += colWidths.mealName;
      doc.rect(xPos, yPos, colWidths.date, rowHeight);
      doc.text(meal.day, xPos + 2, yPos + 7);

      yPos += rowHeight;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Home Stock | www.homestock.com", 20, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
    }

    doc.save(`Meal_Report_${userName}_${todayFormatted}.pdf`);
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

  const validateEmail = (value) => {
    return value.includes('@');
  };

  const validateExtraIngredients = (value) => {
    if (value.trim() === "") {
      setExtraIngredientsError("");
      return true;
    }
    const ingredientsRegex = /^[A-Za-z0-9\s,]*$/;
    if (!ingredientsRegex.test(value)) {
      setExtraIngredientsError("Extra ingredients can only contain letters, numbers, spaces, and commas.");
      return false;
    }
    const ingredientsArray = value.split(",").map(item => item.trim());
    if (ingredientsArray.some(item => item === "")) {
      setExtraIngredientsError("Extra ingredients cannot contain empty entries between commas.");
      return false;
    }
    setExtraIngredientsError("");
    return true;
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setNewMeal({ ...newMeal, userName: value });
    validateUserName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewMeal({ ...newMeal, email: value });
    setEmailError("");
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
      localStorage.setItem('selectedMealIngredients', JSON.stringify(mealData.basicIngredients));
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
      setEmailError("");
      setExtraIngredientsError("");
      setFormError("");
      setEditingMeal(null);
    } catch (err) {
      console.error("Error saving meal:", err);
      setFormError(err.response?.data?.error || "Failed to save meal. Please try again.");
    }
  };

  const handleDeleteMeal = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await axios.delete(`http://localhost:7001/api/meals/${id}`);
        const updatedMeals = meals.filter((meal) => meal._id !== id);
        setMeals(updatedMeals);
        setFilteredMeals(updatedMeals);
        setFormError("");
        alert('Meal deleted successfully!');
      } catch (err) {
        console.error("Error deleting meal:", err);
        setFormError("Failed to delete meal. Please try again.");
      }
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
            Generate PDF Report
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {formError}
          </div>
        )}

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
              {filteredMeals.map((meal) => (
                <tr key={meal._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-700">{meal.mealId}</td>
                  <td className="p-4 text-gray-700">{meal.userName}</td>
                  <td className="p-4 text-gray-700">{meal.email}</td>
                  <td className="p-4 text-gray-700">{meal.mealName}</td>
                  <td className="p-4 text-gray-700">{meal.mealType}</td>
                  <td className="p-4 text-gray-700">{meal.calories}</td>
                  <td className="p-4 text-gray-700">{meal.ingredients}</td>
                  <td className="p-4 text-gray-700">{meal.day}</td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setEditingMeal(meal);
                        setNewMeal({
                          mealId: meal.mealId,
                          userName: meal.userName,
                          email: meal.email,
                          mealName: meal.mealName,
                          mealType: meal.mealType,
                          calories: meal.calories.toString(),
                          ingredients: meal.ingredients,
                          day: meal.day,
                        });
                        setSelectedMeal(meal.mealName);
                        setExtraIngredients("");
                        setShowForm(true);
                        setFormError("");
                        setUserNameError("");
                        setEmailError("");
                        setExtraIngredientsError("");
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingMeal ? "Edit Meal Plan" : "Create New Meal Plan"}
              </h3>
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Meal ID</label>
                  <input
                    type="text"
                    value={newMeal.mealId}
                    onChange={(e) => setNewMeal({ ...newMeal, mealId: e.target.value })}
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                    placeholder="e.g., 0001"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">User Name</label>
                  <input
                    type="text"
                    value={newMeal.userName}
                    onChange={handleUserNameChange}
                    className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 ${
                      userNameError ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="e.g., John Doe"
                  />
                  {userNameError && (
                    <p className="text-red-500 text-xs mt-1">{userNameError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={newMeal.email}
                    onChange={handleEmailChange}
                    className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 ${
                      emailError ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="e.g., john@example.com"
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Meal Type</label>
                  <select
                    value={newMeal.mealType}
                    onChange={handleMealTypeChange}
                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Meal</label>
                  <select
                    value={selectedMeal}
                    onChange={handleMealSelection}
                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                  >
                    <option value="">Select a meal</option>
                    {mealOptions[newMeal.mealType].map((meal, index) => (
                      <option key={index} value={meal.name}>
                        {meal.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Calories</label>
                  <input
                    type="text"
                    value={newMeal.calories}
                    disabled
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700"
                    placeholder="Calories will be auto-filled"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Basic Ingredients</label>
                  {newMeal.ingredients ? (
                    <ul className="space-y-2">
                      {newMeal.ingredients.split(", ").map((ingredient, index) => (
                        <li key={index} className="flex items-center text-gray-700 text-sm">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {ingredient}
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              inventory.some(
                                (item) =>
                                  item.name.toLowerCase().trim() ===
                                  ingredient.toLowerCase().trim()
                              )
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {inventory.some(
                              (item) =>
                                item.name.toLowerCase().trim() ===
                                ingredient.toLowerCase().trim()
                            )
                              ? "In Stock"
                              : "Not in Stock"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">Select a meal to view ingredients</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Extra Ingredients (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={extraIngredients}
                    onChange={handleExtraIngredientsChange}
                    className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 ${
                      extraIngredientsError ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="e.g., cheese, parsley"
                  />
                  {extraIngredientsError && (
                    <p className="text-red-500 text-xs mt-1">{extraIngredientsError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={newMeal.day}
                    onChange={(e) => setNewMeal({ ...newMeal, day: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleSaveMeal}
                  className="bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                >
                  {editingMeal ? "Update Meal" : "Save Meal"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingMeal(null);
                    setFormError("");
                    setUserNameError("");
                    setEmailError("");
                    setExtraIngredientsError("");
                  }}
                  className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}