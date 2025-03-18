import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function NotificationHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [error, setError] = useState(null);
  const userId = 'USER_ID_HERE'; // Replace with actual user ID

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

  const filteredAndSortedHistory = [...history]
    .filter((notif) => filter === 'all' || notif.status === filter)
    .sort((a, b) => (sort === 'newest' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)));

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-vector/history-concept-illustration_114360-1038.jpg?size=626&ext=jpg&ga=GA1.1.1321981104.1719609600&semt=ais)`,
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-4xl mx-auto min-h-screen flex flex-col justify-between p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Notification History
          </h1>
          <Link to="/notification-and-expiry-alerts" className="text-blue-200 hover:text-blue-400 text-lg font-medium transition-colors">
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
              <p className="text-gray-200 text-lg">No notification history available.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredAndSortedHistory.map((notif) => (
                <li key={notif._id} className="border border-gray-200 p-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Alert</h3>
                      <p className="text-gray-700 mt-2">{notif.message}</p>
                      <p className="text-sm text-gray-500 mt-1">Item ID: {notif.itemId}</p>
                      <p className="text-sm text-gray-500 mt-1">Status: <span className={notif.status === 'active' ? 'text-green-600' : 'text-gray-500'}>{notif.status}</span></p>
                      <p className="text-sm text-gray-500 mt-1">Created: {new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationHistory;