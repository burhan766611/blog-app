import React, { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reslt = await API.post("/addData", { data: formData });
      console.log(reslt);
      if( reslt.data.success){
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert("User already Exists");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      alert("Signup failed!");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">SignUp</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="pass"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                type="password"
                id="pass"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
