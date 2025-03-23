import { useState, useEffect } from "react";
import axios from "axios";

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [newMeal, setNewMeal] = useState({
    mealId: "",
    userName: "",
    email: "",
    mealName: "",
    mealType: "Breakfast",
    calories: "",
    ingredients: "",
    day: "Monday",
  });

  useEffect(() => {
    axios
      .get("http://localhost:7001/api/meals")
      .then((res) => {
        setMeals(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSaveMeal = async () => {
    try {
      if (editingMeal) {
        const res = await axios.put(
          `http://localhost:7001/api/meals/${editingMeal._id}`,
          newMeal
        );
        setMeals(meals.map((meal) => (meal._id === editingMeal._id ? res.data : meal)));
      } else {
        const res = await axios.post("http://localhost:7001/api/meals", newMeal);
        setMeals([...meals, res.data]);
      }
      setShowForm(false);
      setNewMeal({
        mealId: "",
        userName: "",
        email: "",
        mealName: "",
        mealType: "Breakfast",
        calories: "",
        ingredients: "",
        day: "Monday",
      });
      setEditingMeal(null);
    } catch (err) {
      console.log(err.response ? err.response.data : err);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`http://localhost:7001/api/meals/${id}`);
      setMeals(meals.filter((meal) => meal._id !== id));
    } catch (err) {
      console.log(err.response ? err.response.data : err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Meal Planning</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingMeal(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add New Meal
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-100 rounded-lg overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Meal ID</th>
              <th className="p-4 text-left">User Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Meal Name</th>
              <th className="p-4 text-left">Meal Type</th>
              <th className="p-4 text-left">Calories</th>
              <th className="p-4 text-left">Ingredients</th>
              <th className="p-4 text-left">Day</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="border-b">
                <td className="p-4">{meal.mealId || "N/A"}</td>
                <td className="p-4">{meal.userName || "N/A"}</td>
                <td className="p-4">{meal.email || "N/A"}</td>
                <td className="p-4">{meal.mealName}</td>
                <td className="p-4">{meal.mealType}</td>
                <td className="p-4">{meal.calories}</td>
                <td className="p-4">{meal.ingredients}</td>
                <td className="p-4">{meal.day}</td>
                <td className="p-4">
                  <button
                    onClick={() => {
                      setNewMeal(meal);
                      setEditingMeal(meal);
                      setShowForm(true);
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="text-red-500 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingMeal ? "Edit Meal" : "Add New Meal"}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Meal ID"
                value={newMeal.mealId}
                onChange={(e) => setNewMeal({ ...newMeal, mealId: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="User Name"
                value={newMeal.userName}
                onChange={(e) => setNewMeal({ ...newMeal, userName: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newMeal.email}
                onChange={(e) => setNewMeal({ ...newMeal, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Meal Name"
                value={newMeal.mealName}
                onChange={(e) => setNewMeal({ ...newMeal, mealName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={newMeal.mealType}
                onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
              <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Ingredients (comma separated)"
                value={newMeal.ingredients}
                onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
              <select
                value={newMeal.day}
                onChange={(e) => setNewMeal({ ...newMeal, day: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewMeal({
                    mealId: "",
                    userName: "",
                    email: "",
                    mealName: "",
                    mealType: "Breakfast",
                    calories: "",
                    ingredients: "",
                    day: "Monday",
                  });
                  setEditingMeal(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}