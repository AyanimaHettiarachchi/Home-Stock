import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateFamily from "./pages/CreateFamily";
import JoinFamily from "./pages/JoinFamily";
import Inventory from "./pages/Inventory";
import Footer from "./components/Footer";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-family" element={<CreateFamily />} />
        <Route path="/join-family" element={<JoinFamily />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
};

export default App;