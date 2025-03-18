import { useEffect, useState } from "react";
import axios from "axios";

const GroceryList = () => {
  const [groceries, setGroceries] = useState([]);

  const fetchItems = async () => {
    const response = await axios.get("http://localhost:5000/api/groceries");
    setGroceries(response.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/api/groceries/${id}`);
    fetchItems();
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Grocery List</h2>
      {groceries.map((item) => (
        <div key={item._id} className="bg-gray-100 p-3 rounded my-2 flex justify-between">
          <p>{item.itemName} (Exp: {item.expiryDate})</p>
          <button onClick={() => deleteItem(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default GroceryList;
