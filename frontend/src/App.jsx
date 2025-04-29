// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './HomePage/Home';
import NotificationHome from './NotificationAlerts/NotificationHome';
import Notifications from './NotificationAlerts/Notifications';
import NotificationSettings from './NotificationAlerts/NotificationSettings';
import NotificationHistory from './NotificationAlerts/NotificationHistory';

import About from './HomePage/About'; // New page
import Contact from './HomePage/Contact'; // New page
import PrivacyPolicy from './HomePage/PrivacyPolicy'; // New page
import MealList from './MealPlaning/MealList';
import MealPlanningDashboard from './MealPlaning/MealPlanningDashboard';
import NutritionPage from './MealPlaning/NutritionPage';
import RecipesPage from './MealPlaning/RecipesPage';
import BulkMealPlanning from './MealPlaning/BulkMealPlanning';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> {/* New route */}
        <Route path="/contact" element={<Contact />} /> {/* New route */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* New route */}
        <Route path="/notification-and-expiry-alerts" element={<NotificationHome />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notification-settings" element={<NotificationSettings />} />
        <Route path="/notification-history" element={<NotificationHistory />} />
        <Route path="/MealList" element={<MealList />} />
        <Route path="/meal-planning-dashboard" element={<MealPlanningDashboard />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/bulk-meal-planning" element={<BulkMealPlanning />} /> {/* Updated route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;