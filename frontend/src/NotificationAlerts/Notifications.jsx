import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const userId = 'USER_ID_HERE'; // Replace with actual user ID

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/${userId}`);
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Check backend.');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.delete(`http://localhost:7001/api/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error dismissing notification:', err);
      setError('Failed to dismiss notification.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative md:bg-contain md:bg-repeat-x"
      style={{
        backgroundImage: `url(https://i.pinimg.com/736x/b4/d7/3c/b4d73c48bec25683fd552975b7da9e13.jpg)`,
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/30"></div>

      <div className="relative max-w-4xl mx-auto min-h-screen flex flex-col justify-between p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Active Alerts
          </h1>
          <Link to="/notification-and-expiry-alerts" className="text-blue-200 hover:text-blue-400 text-lg font-medium transition-colors">
            Back to Notification Home
          </Link>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg relative z-10">
          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-200 text-lg">No active notifications at the moment.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">Total Active Alerts: <span className="font-semibold">{notifications.length}</span></p>
              <ul className="space-y-4">
                {notifications.map((notif) => (
                  <li key={notif._id} className="border border-gray-200 p-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Alert</h3>
                        <p className="text-gray-700 mt-2">{notif.message}</p>
                        <p className="text-sm text-gray-500 mt-1">Item ID: {notif.itemId}</p>
                        <p className="text-sm text-gray-500 mt-1">Created: {new Date(notif.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDismiss(notif._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors ml-4"
                      >
                        Dismiss
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;