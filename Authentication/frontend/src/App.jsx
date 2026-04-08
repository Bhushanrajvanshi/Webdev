import './App.css'
import Home from './components/Home';
import Login from './components/Login'
import Navbar from './components/Navbar'
import Register from './components/Register'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { ToastContainer } from "react-toastify";


function App() {
  

  return (
    <BrowserRouter>
      <ToastContainer position='center' />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='register' element={<Register />}/>
        <Route path='login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
