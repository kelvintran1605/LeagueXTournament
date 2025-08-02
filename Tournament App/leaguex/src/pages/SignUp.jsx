import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { RegisterContext } from "../contexts/RegisterContext";
import { FaExclamationCircle } from "react-icons/fa";

import axios from "axios";
const SignUp = () => {
    const { step, setStep, formData, setFormData } = useContext(RegisterContext);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const [exist, setExist] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/users/check-email", { email: formData.email });
            if (response.data.exists === false) {
                setStep(step + 1);
            }
            else {
                setExist(true);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <main>
            <div className="m-auto text-center flex flex-col">
                <h1 className="text-[2rem] mt-10 font-extrabold text-white">Create your LeagueX account</h1>
                <div className="mt-16 text-white flex items-center justify-center gap-5 bg-[#EF5350] w-[25rem] m-auto rounded-sm py-2">
                    <FaGoogle />
                    <p className="font-bold">Continue with Google</p>
                </div>
                <div className="mt-4 text-white flex items-center justify-center gap-5 pr-9 bg-black w-[25rem] m-auto rounded-sm py-2">
                    <RiTwitterXFill />
                    <p className="font-semibold">Continue with X</p>
                </div>
                <div className="mt-4 text-white flex items-center justify-center pl-5 gap-5 bg-blue-700 w-[25rem] m-auto rounded-sm py-2">
                    <FaFacebookF />
                    <p className="font-semibold">Continue with Facebook</p>
                </div>
                <p className="my-6 text-white">Or</p>
                <form className="flex flex-col w-[25rem] m-auto text-white">
                    <label className="font-bold text-[1.2rem] text-left" htmlFor="email">Email address</label>
                    <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} className="mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white" type="email" placeholder="Enter your email addresss..." />
                    {
                        exist ? <p className="flex items-center gap-2 mt-2 font-bold text-left text-yellow-700"><FaExclamationCircle />Email already exists</p> : ""
                    }
                    <button disabled={!isValid} onClick={handleSubmit} className={`focus:outline-none font-semibold ${isValid ? "bg-[#447D9B]" : "bg-gray-500"} text-white rounded-md py-2 mt-6 mb-6`}>Continue with email</button>
                </form>
                <p className="text-white text-[1.3rem]">Have an account? <Link to="/login" className="text-cyan-500 font-bold">Sign in</Link></p>

            </div>

        </main >
    );
}

export default SignUp;