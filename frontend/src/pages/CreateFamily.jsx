import { useState } from "react";
import { createFamilyGroup } from "../api/api";
import { Link } from "react-router-dom";

const CreateFamily = () => {
  const [form, setForm] = useState({ name: "", sharedPassword: "" });
  const [familyCode, setFamilyCode] = useState(null);
  const [error, setError] = useState(null);

  // Validation state for each input field
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate family name
  const validateName = (name) => {
    if (!name) {
      setNameError("Family name is required.");
      return false;
    }
    if (name.length < 3) {
      setNameError("Family name should be at least 3 characters long.");
      return false;
    }
    setNameError(""); // No error
    return true;
  };

  // Validate shared password
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters long.");
      return false;
    }
    setPasswordError(""); // No error
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate before submission
    const isNameValid = validateName(form.name);
    const isPasswordValid = validatePassword(form.sharedPassword);

    // If any validation fails, don't proceed with the API call
    if (!isNameValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await createFamilyGroup(form);
      setFamilyCode(response.data.familyCode);
    } catch (err) {
      setError(err.response?.data?.error || "Error creating family group");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Family</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {/* Family Name Input */}
        <div className="mb-4">
          <input
            name="name"
            placeholder="Family Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>

        {/* Shared Password Input */}
        <div className="mb-6">
          <input
            name="sharedPassword"
            placeholder="Shared Password"
            type="password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create
        </button>

        {/* Display Family Code after Creation */}
        {familyCode && (
          <div className="mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg text-center">
            <p className="font-semibold">Family Group Created!</p>
            <p>Your Family Code: <span className="text-xl font-bold">{familyCode}</span></p>
          </div>
        )}

        <p className="mt-4 text-center text-gray-600">
          Already have a family?{" "}
          <Link to="/join-family" className="text-blue-600 hover:underline">
            Join Family
          </Link>
        </p>
      </form>
    </div>
  );
};

export default CreateFamily;
