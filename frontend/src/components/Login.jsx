import React, {useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [loginData, setLoginData] = useState({  
      email: "",
      password: "",
    });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({...loginData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{
      const result = await axios.post("http://localhost:3000/login", { data: loginData }, { withCredentials: true });

      if(result.data.success === true){
        alert("Login Succesfully");
        navigate("/index")
      } else {
        alert("Invalid credentials");
      }
    } catch(err){
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={loginData.email}
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
                name="password"
                id="pass"
                value={loginData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
