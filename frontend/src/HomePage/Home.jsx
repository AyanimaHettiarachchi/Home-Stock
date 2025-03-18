import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Home Stock</h1>
        <p>Inventory & Grocery Tracker</p>
      </header>
      
      <main className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link to="/inventory" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold">Inventory</h2>
            <p>Manage your items</p>
          </Link>
          <Link to="/notification-and-expiry-alerts" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold">Notification and Expiry Alerts</h2>
            <p>Manage alerts and settings</p>
          </Link>
          <Link to="/meal-planning" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold">Meal Planning</h2>
            <p>Smart shopping lists</p>
          </Link>
          <Link to="/user-authentication" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold">User Authentication</h2>
            <p>User management</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;