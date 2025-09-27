import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Index from "./components/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

function App() {
  const { isLoggedIn} =  useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/index"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Index />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
