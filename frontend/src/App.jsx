import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home'
import Index from './components/Index';

function App() {
  return (
    <>
      <Router>
          <Routes>
              <Route  path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />}/>
              <Route path="/index" element={<Index />} />
          </Routes>
      </Router>
    </>
  )
}

export default App
