import { Outlet } from "react-router-dom";
import { RegisterContext } from "../contexts/RegisterContext";
import { useContext, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import SignUp from "../pages/SignUp";
import Password from "../components/steps/Password";
import BasicInfo from "../components/steps/BasicInfo";
import Position from "../components/steps/Position";
const SignUpLayout = () => {
    const { step, setStep } = useContext(RegisterContext);
    return (
        <main className="bg-[#1d2033] min-h-screen pt-20">
            {step !== 1 ?
                <>
                    <div onClick={() => setStep(step - 1)} className="transition duration-200 hover:scale-90 w-[6rem] p-2 rounded-md gap-2 flex items-center text-white bg-gray-600 bg-opacity-55 font-bold ml-10 text-[1rem] justify-center cursor-pointer">
                        <IoIosArrowBack />
                        <span className="font-extrabold">BACK</span>
                    </div>
                </> : ""}
            <div className="bg-white rounded-full w-[7rem] m-auto">
                <img className="w-[7rem] h-[7rem] object-cover" src="/images/logo2.png" alt="Logo" />
            </div>

            {
                step === 1 ? <SignUp /> :
                    step === 2 ? <Password /> :
                        step === 3 ? <BasicInfo /> :
                            step === 4 && <Position />
            }
        </main>
    );
}

export default SignUpLayout;