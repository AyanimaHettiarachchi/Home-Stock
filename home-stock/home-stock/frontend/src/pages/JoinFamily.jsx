import { useState } from "react";
import { joinFamilyGroup } from "../api/api";

const JoinFamily = () => {
  const [form, setForm] = useState({ familyCode: "", sharedPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await joinFamilyGroup(form);
      alert("Joined Family Group!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error joining family group");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Family</h2>
        <div className="mb-4">
          <input name="familyCode" placeholder="4-Digit Family Code" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="mb-6">
          <input name="sharedPassword" placeholder="Shared Password" type="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Join</button>
      </form>
    </div>
  );
};

export default JoinFamily;
