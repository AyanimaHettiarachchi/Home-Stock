import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, accountType, logout } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there is a valid user and accountType in localStorage
    const storedUser = localStorage.getItem("user");
    const storedType = localStorage.getItem("accountType");
    
    if (storedUser && storedType) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user, accountType]); // Triggers when `user` or `accountType` changes

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
          {isAuthenticated ? ( // Check if the user is authenticated
            <>
              {accountType === "individual" && (
                <Link to="/" className="mr-4 text-white hover:text-blue-200">
                Home
              </Link>
              )}

              {accountType === "family" && (
                <Link to="/" className="mr-4 text-white hover:text-blue-200">
                  Home
                </Link>
              )}

              {/* Always Show Logout Button When Logged In */}
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/join-family" className="mr-4 text-white hover:text-blue-200">Family Login</Link>
              <Link to="/login" className="text-white hover:text-blue-200">User Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
