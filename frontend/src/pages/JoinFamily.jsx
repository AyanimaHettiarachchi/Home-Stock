import { useState, useContext } from "react";
import { joinFamilyGroup } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const JoinFamily = () => {
  const [form, setForm] = useState({ familyCode: "", sharedPassword: "" });
  const { joinFamily } = useContext(AuthContext);  // Using context for joining family
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error
    
    try {
      const response = await joinFamilyGroup(form);
      const token = response.data.token; // This should be returned from the backend
      localStorage.setItem("familyToken", token); // Store the token securely

      // Join the family using context
      joinFamily(response.data.familyGroup);  // Update context with family data

      alert("Successfully joined family group!");
      navigate("/"); // Redirect to dashboard or home page
    } catch (err) {
      setError(err.response?.data?.msg || "Error joining family group");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Family</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mb-4">
          <input name="familyCode" placeholder="4-Digit Family Code" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="mb-6">
          <input name="sharedPassword" placeholder="Shared Password" type="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Join
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have a family group? <Link to="/create-family" className="text-blue-600 hover:underline">Create One</Link>
        </p>
      </form>
    </div>
  );
};

export default JoinFamily;
