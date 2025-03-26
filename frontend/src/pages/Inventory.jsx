import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api/itemApi"; // ✅ Updated Import
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await getItems();
    setItems(data);
  };

  const handleAddOrUpdateItem = async (item) => {
    if (editingItem) {
      await updateItem(editingItem._id, item);
    } else {
      await createItem(item);
    }
    setEditingItem(null);  // ✅ Reset editingItem after submission
    fetchItems();
  };
  

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    fetchItems();
  };

  return (
    <div className="mx-auto p-4">
      {/* ItemForm remains in a smaller container */}
      <div className="max-w-lg mx-auto">
        <ItemForm onSubmit={handleAddOrUpdateItem} itemToEdit={editingItem} />
      </div>
      
      {/* ItemList has a wider container */}
      <div className="w-full max-w-5xl mx-auto mt-8"> {/* Add mt-8 for spacing between Form and List */}
        <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
  
  
};

export default Inventory;
