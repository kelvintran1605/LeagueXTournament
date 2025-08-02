import { useContext, useState } from "react";
import { RegisterContext } from "../../contexts/RegisterContext";
const Name = () => {
    const [validAge, setValidAge] = useState(false);
    const { step, setStep, formData, setFormData } = useContext(RegisterContext);
    const { address } = formData;
    const valid = formData.firstName && formData.lastName && address.city && address.state && address.code && formData.gender && validAge;
    return (
        <div className="text-white m-auto text-center flex flex-col items-center">
            <h1 className="text-[2rem] font-extrabold text-white mt-4">Complete your basic profile details</h1>
            <div className="flex flex-col w-[30rem] m-auto mt-4 mb-10">
                {/* First name input */}
                <p className="text-white my-4 font-bold text-left">First Name</p>
                <input placeholder="Enter your first name" className={`text-[1.2rem] mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white w-fulll }`} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} value={formData.firstName} />
                {formData.firstName === "" ? <p className="text-left text-yellow-500">First name is required</p> : ""}

                {/* Last name input */}
                <p className=" my-4 font-bold text-left">Last Name</p>
                <input placeholder="Enter your last name" className={`border-b-2 focus:outline-none py-2 text-[1.2rem] w-full mt-2 h-14 border-2 rounded-md  px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white w-fulll`} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} value={formData.lastName} />
                {formData.lastName === "" ? <p className="text-left text-yellow-500">Last name is required</p> : ""}

                {/* Address input */}
                <p className=" font-bold text-left my-4">Address</p>

                <div className="flex gap-7 items-center">
                    <div>
                        <p className="text-left font-semibold mb-2">City</p>
                        <input onChange={(e) => setFormData({ ...formData, address: { ...address, city: e.target.value } })} value={address.city} className="border-2 rounded-md border-gray-400 w-36 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white bg-gray-900" type="text" />
                    </div>
                    <div>
                        <p className="text-left font-semibold mb-2">State</p>
                        <select className="border-2 rounded-md border-gray-400 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white bg-gray-900" name="state" value={address.state} onChange={(e) => setFormData({ ...formData, address: { ...address, state: e.target.value } })}>
                            <option value="">Select</option>
                            <option value="Ontario">Ontario</option>
                            <option value="BC">British Columbia</option>
                            <option value="Quebec">Quebec</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-left font-semibold mb-2 rounded-md">Zip code</p>
                        <input className="border-2 rounded-md border-gray-400 w-36 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white bg-gray-900" type="text" value={address.code} onChange={(e) => setFormData({ ...formData, address: { ...address, code: e.target.value } })}
                        />
                    </div>
                </div>

                {/* Gender */}
                <p className="text-left font-semibold my-4 rounded-md">Gender</p>

                <select className="w-36 border-2 text-black border-gray-400" name="gender" value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select> <br />

                <div className="text-left flex gap-4 items-center">
                    <input checked={validAge}
                        onChange={(e) => setValidAge(e.target.checked)} className="scale-150" type="checkbox" />
                    <p>I confirm that I am 16 years of age or older.</p>
                </div>

                <button disabled={!valid} onClick={(e) => { setStep(step + 1); e.preventDefault() }} className={`rounded-md w-full font-semibold py-2 mt-10 ${valid ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}>Next</button>
            </div>
        </div>
    );
}

export default Name;