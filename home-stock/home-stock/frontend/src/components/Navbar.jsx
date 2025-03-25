import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
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
              `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/notification-and-expiry-alerts"
            className={({ isActive }) =>
              `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
            }
          >
            Notifications
          </NavLink>
          <NavLink
            to="/notification-settings"
            className={({ isActive }) =>
              `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
            }
          >
            Settings
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
            }
          >
            Inventory
          </NavLink>
        </nav>
        <div className="flex items-center">
          {!user ? (
            <>
              <Link to="/register" className="mr-4 text-white hover:text-blue-200">Register</Link>
              <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
            </>
          ) : (
            <>
              <Link to="/create-family" className="mr-4 text-white hover:text-blue-200">Create Family</Link>
              <Link to="/join-family" className="mr-4 text-white hover:text-blue-200">Join Family</Link>
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
