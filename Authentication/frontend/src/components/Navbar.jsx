import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, {withCredentials: true});
      toast.success("Logout successful ✅",{ autoClose: 1500 } )
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Something went wrong ❌")
    }
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between sticky-top">
      
      <div>
        <h1 className="text-xl font-bold">MyApp</h1>
      </div>

      <div className="space-x-4">
        <Link to="/" className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"> HOME </Link>
        <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"> LOGIN </Link>
        <Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"> REGISTER </Link>
        <Link onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"> LOGOUT </Link>
      </div>
    </nav>
  );
}

export default Navbar;