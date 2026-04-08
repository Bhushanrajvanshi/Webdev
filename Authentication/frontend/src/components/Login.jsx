import { useState } from 'react'
import axios from "axios"
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const[ login, setLogin ] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(
                "http://localhost:5000/api/login",
                login,
                { withCredentials: true }
            )
            console.log(res.data);
            localStorage.setItem("generateToken", res.data.generateToken);
            setLogin({
                email: "",
                password: "",
            })
            toast.success("Login successful ✅",{ autoClose: 1500 });
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            console.log(error.data?.data || error.message)
            toast.error("Invalid email or password ❌")
        }
    }


  return (
    <section className='min-h-screen w-full'>
        <div className='flex items-center justify-center'>
            <form onSubmit={ handleSubmit } className='p-4'>
                <div className='mb-4 flex flex-col'>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Enter your email</label>
                    <input 
                    type="text" 
                    name='email' 
                    value={login.email}
                    placeholder='example@gmail.com' 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className='mb-4 flex flex-col'>
                    <label htmlFor="password" className="block text-gray-700 mb-1">Enter your password</label>
                    <input 
                    type="text" 
                    name='password' 
                    value={login.password}
                    placeholder='password' 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <button type='submit' className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition duration-200">LOGIN</button>
            </form>
        </div>
    </section>
  )
}

export default Login