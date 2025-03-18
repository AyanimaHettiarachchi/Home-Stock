import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './HomePage/Home';
import NotificationHome from './NotificationAlerts/NotificationHome';
import Notifications from './NotificationAlerts/Notifications';
import NotificationSettings from './NotificationAlerts/NotificationSettings';
import NotificationHistory from './NotificationAlerts/NotificationHistory';
import AlertCreation from './NotificationAlerts/AlertCreation';


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
      </Routes>
    </BrowserRouter>
  );
}

export default App;