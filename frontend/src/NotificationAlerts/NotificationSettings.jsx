import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    frequency: 'daily',
    timeZone: 'UTC',
    lowStockThreshold: 10,
    expiryThresholdDays: 7,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const userId = 'USER_ID_HERE'; // Replace with actual user ID

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/notifications/preferences/${userId}`);
      setPreferences(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Failed to load preferences.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (preferences.lowStockThreshold < 1 || preferences.expiryThresholdDays < 1) {
      setError('Threshold values must be at least 1.');
      return;
    }
    try {
      await axios.put(`http://localhost:7001/api/notifications/preferences/${userId}`, preferences);
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://i.pinimg.com/736x/e8/ac/a2/e8aca2b17ecd737d39330064b70acb6a.jpg)`,
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-4xl mx-auto min-h-screen flex flex-col justify-between p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Notification Settings
          </h1>
          <Link to="/notification-and-expiry-alerts" className="text-blue-200 hover:text-blue-400 text-lg font-medium transition-colors">
            Back to Notification Home
          </Link>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg relative z-10">
          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
          {success && <p className="text-green-600 mb-4 font-medium">Preferences saved successfully!</p>}
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">Notification Channels</label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.push}
                    onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-700">Push</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Frequency</label>
              <select
                value={preferences.frequency}
                onChange={(e) => setPreferences({ ...preferences, frequency: e.target.value })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="instant">Instant</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Time Zone</label>
              <select
                value={preferences.timeZone}
                onChange={(e) => setPreferences({ ...preferences, timeZone: e.target.value })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="PST">PST</option>
                <option value="EST">EST</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Low Stock Threshold</label>
              <input
                type="number"
                value={preferences.lowStockThreshold}
                onChange={(e) => setPreferences({ ...preferences, lowStockThreshold: Number(e.target.value) })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Expiry Threshold (Days)</label>
              <input
                type="number"
                value={preferences.expiryThresholdDays}
                onChange={(e) => setPreferences({ ...preferences, expiryThresholdDays: Number(e.target.value) })}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="e.g., 7"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;