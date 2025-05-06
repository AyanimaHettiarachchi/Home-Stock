import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotificationHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ message: '', status: '' });
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/history/${userId}`);
      setHistory(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load notification history.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to dismiss this notification?')) return;
    try {
      await axios.delete(`http://localhost:7001/api/notifications/${id}`);
      setHistory(history.filter((notif) => notif._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification.');
    }
  };

  const handleEdit = (notif) => {
    setEditingId(notif._id);
    setEditForm({ message: notif.message, status: notif.status });
  };

  const handleUpdate = async (id) => {
    if (!editForm.message.trim()) {
      setError('Message cannot be empty.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:7001/api/notifications/${id}`, editForm);
      setHistory(history.map((notif) => (notif._id === id ? response.data : notif)));
      setEditingId(null);
      setError(null);
    } catch (error) {
      console.error('Error updating notification:', error);
      setError(error.response?.data?.error || 'Failed to update notification.');
    }
  };

  const filteredAndSortedHistory = [...history]
    .filter((notif) => filter === 'all' || notif.status === filter)
    .sort((a, b) =>
      sort === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://media.istockphoto.com/id/1589489985/photo/young-cheerful-woman-at-the-market.jpg?s=612x612&w=0&k=20&c=eebhAyDth23n58XOJ2nMea7z-OKST0M2TW7o6rsYZUA=)`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 md:bg-black/40 lg:bg-black/30"></div>

      <div className="relative min-h-screen flex flex-col">
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
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/notification-and-expiry-alerts"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Notifications
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Inventory
              </NavLink>
              <NavLink
                to="/meal-planning-dashboard"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Meal Planning
              </NavLink>
              <NavLink
                to="/notification-settings"
                className={({ isActive }) =>
                  `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${
                    isActive ? 'underline underline-offset-4' : ''
                  }`
                }
              >
                Settings
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-10">
          <motion.div className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Notification History
              </h1>
              <Link
                to="/notification-and-expiry-alerts"
                className="text-blue-600 hover:text-blue-900 text-lg font-medium transition-colors"
              >
                Back to Notification Home
              </Link>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg relative z-10">
              {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
              <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-lg font-medium text-gray-700">Filter by Status</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-lg font-medium text-gray-700">Sort by</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              {filteredAndSortedHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No notification history available.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {filteredAndSortedHistory.map((notif) => (
                    <li
                      key={notif._id}
                      className="border border-gray-200 p-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition-colors"
                    >
                      {editingId === notif._id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editForm.message}
                            onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Edit message"
                          />
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="dismissed">Dismissed</option>
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdate(notif._id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Alert
                            </h3>
                            <p className="text-gray-700 mt-2">{notif.message}</p>
                            {notif.itemId && <p className="text-sm text-gray-500 mt-1">Item: {notif.itemId}</p>}
                            <p className="text-sm text-gray-500 mt-1">
                              Status: <span className={notif.status === 'active' ? 'text-green-600' : 'text-gray-500'}>{notif.status}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Created: {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(notif)}
                              className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(notif._id)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </main>

        <footer className="w-full bg-gradient-to-r from-gray-900/80 to-gray-900/80 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Footer Logo"
                className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
              />
              <p className="text-white text-sm md:text-base">© 2025 Home Stock. All rights reserved.</p>
            </div>
            <div className="flex justify-center space-x-4 md:space-x-6 mb-4">
              <a
                href="#about"
                className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
              >
                Contact
              </a>
              <a
                href="#privacy"
                className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NotificationHistory;