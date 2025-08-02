import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { FaExclamationCircle } from "react-icons/fa";
import { apiLogin } from "../api/user";
import { login } from '../store/auth-slice';

const Login = () => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isValid, setValid] = useState(true);
    const handleGoBack = () => {
        navigate("/");
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await apiLogin(email, password);
        if (user) {
            dispatch(login({
                _id: user._id,
                name: user.name,
                email: user.email,
                position: user.position,
                gender: user.gender,
                location: user.location,
                teamId: user.teamId,
                role: user.role,
                profileImageUrl: user.profileImage.url,
                skipAuthCheck: true
            }));
            if (user.role === "user") {
                navigate("/user-dashboard/browse-team");
            }
            else if (user.role === "admin") {
                navigate("/admin-dashboard");
            }
        }
        else {
            setValid(false);
        }
    };
    return (
        <main className="relative flex justify-center items-center h-screen text-white bg-[#1d2033]">
            <div className="w-1/2 h-screen object-cover bg-no-repeat relative flex flex-col items-center justify-center">
                <h2 className="z-10 w-1/2 text-center tracking-widest text-[3rem] font-bold">LEAGUE<span className="text-orange-500">X</span> <span>SOCCER</span></h2>
                <div className="z-10 text-center text-gray-200 text-[1.3rem] w-1/2">Join the ultimate soccer experience where leagues meet innovation</div>
                <img src="/images/login-background.jpg" className="absolute w-full h-full z-2 object-cover" />
                <div className="bg-black absolute inset-0 w-full h-full z-2 opacity-50"></div>
            </div>
            <div className="w-1/2 items-center flex flex-col font-heading">
                <FaTimes onClick={handleGoBack} className="hover:text-red-500 transition duration-100 absolute top-4 right-4 text-gray-500 cursor-pointer text-xl" />
                <h1 className="font-extrabold text-3xl mt-8 mb-2">Welcome Back</h1>
                <p>Sign in to continue to your account</p>
                {
                    isValid === false ?
                        <div className="bg-red-100 bg-opacity-40 border-red-700 border-[1.5px] w-80 p-4 rounded-md mb-4">
                            <p className="flex items-center justify-between text-xl">Sign in unsuccessful <FaExclamationCircle className="text-red-700" /></p>
                            <p>The email or password you entered is not valid. Please try again.</p>
                        </div>
                        : ""
                }
                <form className="w-[30rem] flex flex-col z-10 mt-10">
                    <label className="font-semibold mb-2" htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        className="w-full mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white"
                        placeholder="Type you email"
                        required />

                    <label className="font-semibold mb-2 text-white mt-4" htmlFor="email">Password</label>
                    <div className="relative mb-2">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white"
                            type={visible ? "text" : "password"}
                            placeholder="Type your password"
                            required
                        />
                        {visible ? <FaEye onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" /> : <FaEyeSlash onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />}
                    </div>

                    <div className="flex justify-end">
                        <Link className="mb-4 text-sky-600 mt-4 underline">Forgot password?</Link >
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="h-10 w-full rounded-full bg-gradient-to-r from-[#ff416c] to-[#FF4B2B] 
                        transition duration-300 ease-in-out over:from-blue-600 hover:via-red-500 hover:to-red-500">
                        Sign In
                    </button>
                </form>
                <p className="text-gray-500 mt-12">Or Sign In Using</p>
                <div className="flex items-center gap-5 mt-2">
                    <FaFacebook className="text-blue-600 text-5xl" />
                    <img className="w-[74px]" src="/images/google.png" />
                    <img className="rounded-full w-[50px]" src="/images/X.jpg" />
                </div>
                <p className="mt-[3rem] mb-[30px]">Don't have an account? <Link onClick={() => navigate('/create-account')} className="font-extrabold text-blue-600">Sign Up now</Link></p>
            </div>

        </main >
    );
}

export default Login;