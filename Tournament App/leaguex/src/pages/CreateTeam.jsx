import { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { replace, useNavigate } from 'react-router-dom';
import { createTeam } from "../store/auth-slice";
const CreateTeam = () => {
    const { _id, teamId } = useSelector(state => state.auth);
    const [image, setImage] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [isValidForm, setIsValidForm] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        contactEmail: "",
        city: "",
        state: ""
    });
    // Handle text input changes
    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    // Handle uploading team logo
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setPreviewSrc(tempUrl)
            setImage(file);
        }
    }
    // Handle submit form
    const handleSubmit = async () => {
        console.log(formData, image);
        if (image && Object.values(formData).every(value => value !== "")) {
            setIsValidForm(true);

            // Initialize Form Data object
            const data = new FormData();

            // Concat city and state into location
            const location = formData.city + ", " + formData.state;
            data.append("captainId", _id);
            data.append("image", image);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("location", location);
            data.append("contactEmail", formData.contactEmail);
            try {
                const teamResponse = await axios.post("http://localhost:8000/teams/create", data, { withCredentials: true });
                const teamId = teamResponse.data._id;
                console.log(teamId);
                dispatch(createTeam(teamId));
                const response = await axios.put("http://localhost:8000/users/createTeamId", { _id, teamId })
                console.log("Created Team successfully");
                navigate("/user-dashboard/team");
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            setIsValidForm(false);
        }
    }

    useEffect(() => {
        if (teamId) {
            navigate("/user-dashboard/team", { replace: true });
        }
    })
    return (
        <main style={{ backgroundImage: "url('/images/soccer-field.jpg')" }} className="relative bg-contain bg-[#1d2033] min-h-screen text-white pt-10">
            <div className="w-full h-full absolute opacity-50 inset-0 bg-black z-0"></div>
            <div className="z-10 relative">
                <h1 className="text-center text-[2rem] font-bold">Create Your Team</h1>
                <p className="text-center text-gray-300 mb-7">Set up your soccer team profile for your LeagueX tournament and start managing your squad today.</p>
                {/* Create Team Form */}
                <div className="p-6 bg-gray-900 bg-opacity-50 rounded-md w-1/2 m-auto flex flex-col items-center justify-center">
                    {/* Upload Logo */}
                    <div className={`rounded-full flex flex-col justify-center items-center ${image ? "" : "border-2 border-dashed"} w-28 h-28 border-gray-400`}>
                        {!image ?
                            <>
                                <div className="text-[3rem]">🛡️</div>
                            </>
                            :
                            <img className="w-full h-full rounded-full scale-105" src={previewSrc} />
                        }
                    </div>
                    <div className="flex items-center text-blue-500 font-bold gap-2 mt-2">
                        <div className="flex items-center gap-2 mt-2">
                            <label
                                htmlFor="team-logo"
                                className="cursor-pointer text-blue-500 font-bold flex items-center gap-2"
                            >
                                <MdFileUpload />
                                Upload Team Logo
                            </label>
                            <input
                                type="file"
                                id="team-logo"
                                name="teamLogo"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Team Name */}
                    <div className="w-full flex flex-col">
                        <label htmlFor="team-name">
                            Team Name <span className="text-red-500">*</span>
                        </label>
                        <input onChange={handleTextChange}
                            value={formData.name}
                            name="name"
                            className="mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[1px] focus:ring-white" type="text" placeholder="Enter your team name..." />
                    </div>

                    {/*Team Description*/}
                    <div className="w-full flex flex-col mt-5">
                        <label htmlFor="team-description">
                            Team Description <span className="text-red-500">*</span></label>
                        <textarea onChange={handleTextChange} value={formData.description} name="description" className="pb-28 mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[1px] focus:ring-white" placeholder="Tell us about your team..." />
                    </div>

                    {/* Location */}
                    <div className="w-full gap-4 flex mt-5">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="city">
                                City
                                <span className="text-red-500">*</span>
                            </label>
                            <input value={formData.city} onChange={handleTextChange} name="city" className="w-full mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[1px] focus:ring-white" type="text" placeholder="City" />
                        </div>

                        <div className="flex flex-col w-1/2">
                            <label htmlFor="state">State <span className="text-red-500">*</span></label>
                            <input value={formData.state} onChange={handleTextChange} name="state" className="w-full mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[1px] focus:ring-white" type="text" placeholder="City" />
                        </div>
                    </div>

                    {/* Contact Email */}
                    <div className="w-full flex flex-col mt-5">
                        <label htmlFor="email">Contact Email <span className="text-red-500">*</span></label>
                        <input value={formData.contactEmail} onChange={handleTextChange} name="contactEmail" className="mt-2 h-14 border-2 rounded-md py-2 px-2 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[1px] focus:ring-white" type="email" placeholder="Enter your contact email..." />
                    </div>
                    <p className="text-gray-200 text-center mt-3">By creating a team, you agree to the <span className="text-sky-600">Terms of Service</span> and <span className="text-sky-600">Privacy Policy</span></p>
                    {!isValidForm && <p className="text-red-500">All fields are required</p>}
                    <div className="w-full text-right mt-5">
                        <button className="border-2 hover:bg-gray-500 transition duration-250 border-gray-500 py-2 px-4 rounded-md">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="bg-sky-600 rounded-md ml-2 py-2 px-4 font-bold hover:bg-sky-500 transition duration-250">
                            Create Team
                        </button>
                    </div>
                </div>
            </div>


        </main>
    );
}

export default CreateTeam;