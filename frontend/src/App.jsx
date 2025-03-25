// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './HomePage/Home';
import NotificationHome from './NotificationAlerts/NotificationHome';
import Notifications from './NotificationAlerts/Notifications';
import NotificationSettings from './NotificationAlerts/NotificationSettings';
import NotificationHistory from './NotificationAlerts/NotificationHistory';
import AlertCreation from './NotificationAlerts/AlertCreation';
import MealList from './MealPlaning/MealList';
import MealPlanningDashboard from './MealPlaning/MealPlanningDashboard';
import NutritionPage from './MealPlaning/NutritionPage';
import RecipesPage from './MealPlaning/RecipesPage';
import BulkMealPlanning from './MealPlaning/BulkMealPlanning'; // New import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notification-and-expiry-alerts" element={<NotificationHome />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notification-settings" element={<NotificationSettings />} />
        <Route path="/notification-history" element={<NotificationHistory />} />
        <Route path="/alert-creation" element={<AlertCreation />} />
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