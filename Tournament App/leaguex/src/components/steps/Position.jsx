import { useContext, useState } from "react";
import { RegisterContext } from "../../contexts/RegisterContext";
import { useNavigate } from 'react-router-dom';
import { apiLogin, apiRegister } from "../../api/user";
import { login } from '../../store/auth-slice';

import axios from 'axios';
import { useDispatch } from "react-redux";
const Position = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { step, setStep, formData, setFormData } = useContext(RegisterContext);
    const handleSubmit = async (e, role) => {
        e.preventDefault();
        const updatedForm = { ...formData, position: role };
        setFormData(updatedForm);
        const success = await apiRegister(updatedForm);
        const user = await apiLogin(formData.email, formData.password);
        if (success && user) {
            dispatch(login({
                name: user.name,
                email: user.email,
                position: user.position,
                gender: user.gender,
                location: user.location
            }));
            navigate("/welcome");
        }
    }
    return (
        <div className="text-center text-white flex flex-col items-center gap-6 mt-7">
            <p className="text-lg">Nice to meet you <span className="font-bold text-blue-700 uppercase">Khoa</span>!</p>
            <h1 className="text-3xl font-bold ">Tell us where you shine on the field</h1>

            <div className="grid grid-cols-2 gap-6 mt-8">
                {["Forward", "Midfielder", "Defender", "Goal Keeper"].map((role) => (
                    <button
                        value={role}
                        onClick={(e) => handleSubmit(e, role)}
                        key={role}
                        className="w-48 h-32 border-2 border-blue-400 rounded-xl shadow-md hover:bg-blue-400 hover:scale-105 transition-all font-semibold "
                    >
                        {role}
                    </button>
                ))}
            </div>
        </div>

    );
}

export default Position;