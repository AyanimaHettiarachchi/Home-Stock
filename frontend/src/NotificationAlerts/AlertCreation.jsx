import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AlertCreation() {
  const [newAlert, setNewAlert] = useState({
    type: 'expiry',
    message: '',
    itemId: '',
    userId: 'USER_ID_HERE', // Replace with actual user ID
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAlert.message.trim() || !newAlert.itemId.trim()) {
      setError('Message and Item ID are required.');
      return;
    }
    if (!confirm(`Create ${newAlert.type === 'expiry' ? 'Expiry' : 'Low Stock'} Alert: "${newAlert.message}" for Item ID ${newAlert.itemId}?`)) {
      return;
    }
    try {
      await axios.post('http://localhost:7001/api/notifications', newAlert);
      setSuccess(true);
      setError(null);
      setNewAlert({ type: 'expiry', message: '', itemId: '', userId: newAlert.userId });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating alert:', error);
      setError('Failed to create alert.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-vector/add-new-concept-illustration_114360-1258.jpg?size=626&ext=jpg&ga=GA1.1.1321981104.1719609600&semt=ais)`,
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-4xl mx-auto min-h-screen flex flex-col justify-between p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Create New Alert
          </h1>
          <Link to="/notification-and-expiry-alerts" className="text-blue-200 hover:text-blue-400 text-lg font-medium transition-colors">
            Back to Notification Home
          </Link>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg relative z-10">
          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
          {success && <p className="text-green-600 mb-4 font-medium">Alert created successfully!</p>}
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">Alert Type</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expiry">Expiry</option>
                <option value="low-stock">Low Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Message</label>
              <input
                type="text"
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter alert message"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Item ID</label>
              <input
                type="text"
                value={newAlert.itemId}
                onChange={(e) => setNewAlert({ ...newAlert, itemId: e.target.value })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter item ID"
                required
              />
            </div>
            {newAlert.message && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Preview</h3>
                <p className="text-gray-700">{newAlert.type === 'expiry' ? 'Expiry Alert' : 'Low Stock Alert'}: {newAlert.message}</p>
                <p className="text-sm text-gray-500 mt-1">Item ID: {newAlert.itemId}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Create Alert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AlertCreation;


