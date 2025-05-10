import { useState, useEffect, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID
  const editInputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/history/${userId}`);
      setHistory(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load notification history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to dismiss this notification?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:7001/api/notifications/${id}`);
      setHistory(history.filter((notif) => notif._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification.');
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      const response = await axios.put(`http://localhost:7001/api/notifications/${id}`, editForm);
      setHistory(history.map((notif) => (notif._id === id ? response.data : notif)));
      setEditingId(null);
      setError(null);
    } catch (error) {
      console.error('Error updating notification:', error);
      setError(error.response?.data?.error || 'Failed to update notification.');
    } finally {
      setIsLoading(false);
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/6169148/pexels-photo-6169148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
        backgroundColor: '#1f2937', // Fallback color
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative min-h-screen flex flex-col font-sans text-white" style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:text-black focus:p-2">
          Skip to main content
        </a>

        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/90 to-gray-900/90 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <NavLink to="/" aria-label="Home">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                  alt="Home Stock Logo"
                  className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </NavLink>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Home Stock
              </h1>
            </div>
            <nav className="flex flex-wrap gap-3 md:gap-6">
              {[
                { to: '/', label: 'Home' },
                { to: '/notification-and-expiry-alerts', label: 'Notifications' },
                { to: '/inventory', label: 'Inventory' },
                { to: '/meal-planning-dashboard', label: 'Meal Planning' },
                { to: '/notification-settings', label: 'Settings' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-white text-sm md:text-base hover:text-purple-300 transition-colors duration-300 ${
                      isActive ? 'underline underline-offset-4' : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 md:px-6 py-8">
          <motion.div className="max-w-6xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center">
                Notification History
              </h1>
              <Link
                to="/notification-and-expiry-alerts"
                className="mt-4 text-blue-400 hover:text-blue-600 text-base font-medium transition-colors flex items-center"
                aria-label="Back to Notification Home"
              >
                ← Back
              </Link>
            </div>
            <div className="bg-gray-800/95 backdrop-blur-lg p-6 rounded-xl shadow-xl relative z-10">
              {error && (
                <p
                  className="text-red-400 bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4 font-medium"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
              {isLoading && (
                <div className="flex justify-center mb-4">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="filter-status"
                    className="block text-lg font-medium text-gray-200 mb-1"
                  >
                    Filter by Status
                  </label>
                  <select
                    id="filter-status"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
                    aria-label="Filter notifications by status"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="sort-order" className="block text-lg font-medium text-gray-200 mb-1">
                    Sort by
                  </label>
                  <select
                    id="sort-order"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="block w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
                    aria-label="Sort notifications by date"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              {filteredAndSortedHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">
                    No notification history available.{' '}
                    <Link
                      to="/inventory"
                      className="text-blue-400 hover:text-blue-600"
                      aria-label="Go to Inventory to add items"
                    >
                      Add items to your inventory
                    </Link>{' '}
                    to receive notifications.
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto pr-4">
                  <ul className="space-y-4">
                    {filteredAndSortedHistory.map((notif, index) => (
                      <motion.li
                        key={notif._id}
                        className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-md flex justify-between items-start hover:bg-gray-800 transition-colors"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        {editingId === notif._id ? (
                          <div className="space-y-4 w-full">
                            <div>
                              <label
                                htmlFor={`edit-message-${notif._id}`}
                                className="sr-only"
                              >
                                Edit notification message
                              </label>
                              <input
                                id={`edit-message-${notif._id}`}
                                type="text"
                                value={editForm.message}
                                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                placeholder="Edit notification message"
                                ref={editInputRef}
                                aria-label="Edit notification message"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`edit-status-${notif._id}`}
                                className="sr-only"
                              >
                                Edit notification status
                              </label>
                              <select
                                id={`edit-status-${notif._id}`}
                                value={editForm.status}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                aria-label="Edit notification status"
                              >
                                <option value="active">Active</option>
                                <option value="dismissed">Dismissed</option>
                              </select>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleUpdate(notif._id)}
                                className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors flex items-center gap-2"
                                disabled={isLoading}
                                aria-label={`Save changes for notification ${notif.itemId || notif._id}`}
                              >
                                {isLoading && (
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                )}
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                disabled={isLoading}
                                aria-label="Cancel editing"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between w-full">
                            <div>
                              <h3 className="font-semibold text-gray-200 text-lg">
                                {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Alert
                              </h3>
                              <p className="text-gray-400 mt-2 leading-6">
                                {notif.message.length > 100
                                  ? `${notif.message.slice(0, 100)}...`
                                  : notif.message}
                              </p>
                              {notif.itemId && (
                                <p className="text-sm text-gray-500 mt-1">Item: {notif.itemId}</p>
                              )}
                              <p className="text-sm text-gray-400 mt-1">
                                Status:{' '}
                                <span
                                  className={
                                    notif.status === 'active' ? 'text-green-400' : 'text-gray-500'
                                  }
                                >
                                  {notif.status}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Created: {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(notif)}
                                className="text-green-400 hover:text-green-300 font-medium focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded px-2 py-1"
                                aria-label={`Edit notification for item ${notif.itemId || notif._id}`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(notif._id)}
                                className="text-red-400 hover:text-red-300 font-medium focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded px-2 py-1"
                                aria-label={`Dismiss notification for item ${notif.itemId || notif._id}`}
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </main>

        <footer className="w-full bg-gradient-to-r from-gray-900/90 to-gray-900/90 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Home Stock Logo"
                className="w-8 h-8 object-contain hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <p className="text-gray-300 text-sm md:text-base">© 2025 Home Stock. All rights reserved.</p>
            </div>
            <div className="flex justify-center gap-4 md:gap-6">
              {[
                { href: '#about', label: 'About' },
                { href: '#contact', label: 'Contact' },
                { href: '#privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NotificationHistory;