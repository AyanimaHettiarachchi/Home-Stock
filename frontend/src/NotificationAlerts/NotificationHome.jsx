import { NavLink } from 'react-router-dom';

function NotificationHome() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-vector/abstract-background-design-with-blue-waves_1048-10111.jpg?size=626&ext=jpg&ga=GA1.1.1321981104.1719609600&semt=ais)`,
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-7xl mx-auto min-h-screen flex flex-col justify-between">
        {/* Header */}
        <header className="py-4 flex justify-between items-center px-4 md:px-6">
          <div className="flex items-center space-x-3">
            <NavLink to="https://example.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Header Logo"
                className="w-10 h-10 object-contain hover:opacity-80 transition-opacity"
              />
            </NavLink>
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text">
              Notification Hub
            </h2>
          </div>
          <nav className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white hover:text-blue-200 transition-colors ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `text-white hover:text-blue-200 transition-colors ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Alerts
            </NavLink>
            <NavLink
              to="/notification-settings"
              className={({ isActive }) =>
                `text-white hover:text-blue-200 transition-colors ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Settings
            </NavLink>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text">
              Notification & Expiry Alerts
            </h1>
            <p className="text-gray-200 text-lg mb-10">Manage your alerts with ease and efficiency.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/9840/9840777.png"
                    alt="Active Alerts Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Active Alerts
                    </h2>
                    <p className="text-gray-600 text-sm">View and manage active alerts</p>
                  </div>
                </div>
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </NavLink>

              <NavLink
                to="/notification-settings"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                    alt="Settings Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Settings
                    </h2>
                    <p className="text-gray-600 text-sm">Customize notification preferences</p>
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/notification-history"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/484/484364.png"
                    alt="History Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      History
                    </h2>
                    <p className="text-gray-600 text-sm">View past notifications</p>
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/alert-creation"
                className={({ isActive }) =>
                  `group relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : ''}`
                }
              >
                <div className="flex items-center space-x-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828939.png"
                    alt="Create Alert Icon"
                    className="w-14 h-14 object-cover rounded-lg transition-transform group-hover:scale-110"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Create Alert
                    </h2>
                    <p className="text-gray-600 text-sm">Generate a new alert</p>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-4 md:px-6 bg-black/20 backdrop-blur-md text-center">
          <div className="flex justify-center items-center space-x-3 mb-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
              alt="Footer Logo"
              className="w-8 h-8 object-contain"
            />
            <p className="text-white text-sm">© 2025 Notification Hub. All rights reserved.</p>
          </div>
          <p className="text-gray-400 text-xs">Powered by AT</p>
        </footer>
      </div>
    </div>
  );
}

export default NotificationHome;