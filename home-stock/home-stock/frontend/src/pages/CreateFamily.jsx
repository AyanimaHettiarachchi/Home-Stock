import { useState } from "react";
import { createFamilyGroup } from "../api/api";

const CreateFamily = () => {
  const [form, setForm] = useState({ name: "", sharedPassword: "" });
  const [familyCode, setFamilyCode] = useState(null); // Store the 4-digit code

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createFamilyGroup(form);
      setFamilyCode(response.data.familyCode); // Save the family code
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating family group");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Family</h2>
        <div className="mb-4">
          <input name="name" placeholder="Family Name" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="mb-6">
          <input name="sharedPassword" placeholder="Shared Password" type="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Create</button>

        {familyCode && (
          <div className="mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg text-center">
            <p className="font-semibold">Family Group Created!</p>
            <p>Your Family Code: <span className="text-xl font-bold">{familyCode}</span></p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateFamily;
