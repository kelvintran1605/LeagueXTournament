import React, { useState } from "react";
export const RegisterContext = React.createContext();

export const RegisterArea = ({ children }) => {
    const [formData, setFormData] = useState(
        {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            position: "",
            gender: "",
            address: {
                city: "",
                state: "",
                code: ""
            },
        }
    );
    const [step, setStep] = useState(1);
    return (
        <RegisterContext.Provider value={{ formData, setFormData, step, setStep }}>
            {children}
        </RegisterContext.Provider>
    );
}