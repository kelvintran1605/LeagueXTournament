import { useContext, useEffect, useRef, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import { RegisterContext } from "../../contexts/RegisterContext";
const Password = () => {
    const { step, setStep, formData, setFormData } = useContext(RegisterContext);
    const [visible, setVisible] = useState(false);
    const [valid, setValid] = useState(false);
    const firstRender = useRef(true);
    const [conditions, setConditions] = useState([
        {
            name: "length",
            description: "At least 8 characters",
            matched: null
        },
        {
            name: "lowercase",
            description: "One lowercase character",
            matched: null
        },
        {
            name: "uppercase",
            description: "One uppercase character",
            matched: null
        },
        {
            name: "special",
            description: "One number, symbol or whitespace character",
            matched: null
        }
    ]);
    useEffect(() => {
        const updated = conditions.map(condition => {
            switch (condition.name) {
                case "length":
                    return { ...condition, matched: formData.password.length >= 8 };
                case "lowercase":
                    return { ...condition, matched: /[a-z]/.test(formData.password) };
                case "uppercase":
                    return { ...condition, matched: /[A-Z]/.test(formData.password) };
                case "special":
                    return { ...condition, matched: /[\d\s\W]/.test(formData.password) };
                default:
                    return condition;
            }
        }
        );
        const valid = updated.every(condition => condition.matched === true);
        setValid(valid);
        setConditions(updated);
    }, [formData.password]);
    return (
        <div>
            <div className="m-auto text-center flex flex-col items-center">
                <h1 className="text-[2rem] font-extrabold text-white mt-10">Create your password</h1>
                <p className="text-[1.5rem] font-semibold text-white mt-3">Enter your password for {formData.email}</p>
                <form className="flex flex-col w-[30rem] m-auto mt-10 mb-10">
                    <label className="text-white font-bold text-left" htmlFor="password">PASSWORD</label>
                    <div className="flex items-center justify-center relative mb-4">
                        <input placeholder="Enter your password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} className={`text-white text-[1.3rem] mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white w-full`} type={visible ? "text" : "password"} />
                        {
                            visible ?
                                <FaRegEye onClick={() => setVisible(!visible)} className="absolute text-white right-4" />
                                :
                                <FaRegEyeSlash onClick={() => setVisible(!visible)} className="absolute text-white right-4" />
                        }
                    </div>
                    {
                        conditions.map(condition => (
                            <div className="flex items-center gap-4 w-[30rem] text-white mt-4">
                                {condition.matched === null ? (<FaRegCircle color="gray" />) : condition.matched === true ? (<FaRegCircleCheck color="green" />) : (<FaRegCircleXmark color="red" />)}
                                <p>{condition.description}</p>
                            </div>
                        ))
                    }
                    <button disabled={!valid} onClick={(e) => { setStep(step + 1); e.preventDefault() }} className={`rounded-md w-full font-semibold py-2 mt-10 ${valid ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}>Next</button>
                </form>
            </div>
        </div >
    );
}

export default Password;