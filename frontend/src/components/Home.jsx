import React,{useContext} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-80 bg-white rounded-2xl shadow-xl border-2 border-gray-300 p-8 flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Navigation</h1>

        <Link
          to="/"
          className="w-full text-center py-2 rounded-lg text-blue-600 font-medium hover:bg-blue-50 hover:text-blue-800 transition"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="w-full text-center py-2 rounded-lg text-green-600 font-medium hover:bg-green-50 hover:text-green-800 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="w-full text-center py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 hover:text-red-800 transition"
        >
          Signup
        </Link>
        {isLoggedIn && (
          <Link
            to="/index"
            className="w-full text-center py-2 rounded-lg text-purple-600 font-medium hover:bg-purple-50 hover:text-purple-800 transition"
          >
            Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
