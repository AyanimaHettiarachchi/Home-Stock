import { useState, useContext } from "react";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(form);
      login({ email: form.email });
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <div className="mb-4">
          <input name="email" placeholder="Email" type="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="mb-6">
          <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
      </form>
    </div>
  );
};

export default Login;