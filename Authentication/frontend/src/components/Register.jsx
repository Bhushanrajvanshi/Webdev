import axios from 'axios';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Register() {

    const navigate = useNavigate();

    const [register, setRegister] = useState({
        username: "",
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setRegister({
            ...register,
            [e.target.name] : e.target.value 
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                "http://localhost:5000/api/register",
                register,
                { withCredentials: true }
            )
            console.log(res.data);
            localStorage.setItem("generateToken", res.data.generateToken);
            setRegister({
                username: "",
                email: "",
                password: "",
            })
            toast.success("User Register successful ✅",{ autoClose: 1500 });
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.log(error.data?.data || error.message);
            toast.error("Something gone wrong ! please check details ❌")
        }
    }

  return (
    <section className='min-h-screen w-full'>
        <div className='flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='p-6'>
                <div className='flex flex-col mb-4'>
                    <label htmlFor="username" className="block text-gray-700 mb-1">Enter your full name</label>
                    <input 
                    type="text" 
                    name='username'
                    placeholder='bhushan kumar' 
                    value={register.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className='flex flex-col mb-4'>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Enter your email</label>
                    <input 
                    type="email" 
                    name='email'
                    placeholder='bhushan kumar' 
                    value={register.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className='flex flex-col mb-4'>
                    <label htmlFor="password" className="block text-gray-700 mb-1">Enter your password</label>
                    <input 
                    type="password" 
                    name='password'
                    placeholder='bhushan kumar' 
                     value={register.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <button type='submit' className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">REGISTER</button>
            </form>
        </div>
    </section>
  )
}

export default Register