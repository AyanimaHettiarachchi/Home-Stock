import { useState } from "react";

const ItemList = ({ items, onEdit, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { name: "Dairy", bgImage: "url('../assets/dairy.jpg')" },
    { name: "Vegetables", bgImage: "url('/assets/vegetables.jpg')" },
    { name: "Fruits", bgImage: "url('/assets/fruits.jpg')" },
    { name: "Frozen items", bgImage: "url('/assets/frozen-items.jpg')" },
    { name: "Snack", bgImage: "url('/assets/snack.jpg')" },
  ];

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const getCategoryColor = (category) => {
    const colors = {
      Dairy: "bg-blue-100 text-blue-800",
      Vegetables: "bg-green-100 text-green-800",
      Fruits: "bg-yellow-100 text-yellow-800",
      "Frozen items": "bg-purple-100 text-purple-800",
      Snack: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600 font-medium";
    if (diffDays <= 3) return "text-orange-500 font-medium";
    return "text-gray-600";
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">📦 Inventory Items</h2>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <button
          className="h-32 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg transition relative"
          onClick={() => setSelectedCategory(null)} // Show all items when clicked
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
          <span className="relative z-10">All</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            className="h-32 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg transition relative"
            style={{
              backgroundImage: category.bgImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: selectedCategory === category.name || !selectedCategory ? 1 : 0.5,
            }}
            onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
            <span className="relative z-10">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Item List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found for this category.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <li key={item._id} className="py-4 hover:bg-gray-50 transition px-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                    <span className={getExpiryStatus(item.expiryDate)}>
                      Exp: {new Date(item.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-800 p-3 rounded-full hover:bg-blue-50 transition"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-800 p-3 rounded-full hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;
