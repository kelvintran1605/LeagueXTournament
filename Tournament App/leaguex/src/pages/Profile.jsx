import React, { useEffect, useState } from 'react';
import { MdFileUpload } from "react-icons/md";
import { useSelector } from 'react-redux';
import { teamFetch } from '../api/team';
import { updateProfile, updatePassword } from "../api/user.js";
import { updateAuth } from "../store/auth-slice.js";
import { useDispatch } from 'react-redux';
const Profile = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth) || {};
    const { name = '', email = '', gender = '', position = '', location = '', teamId = '', profileImageUrl = '' } = auth;
    const [previewSrc, setPreviewSrc] = useState(profileImageUrl);
    const [image, setImage] = useState(null);
    const [team, setTeam] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState({});
    const [formData, setFormData] = useState({
        name,
        email,
        gender,
        position,
        location,
    });

    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({ ...formData });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditedData({ ...formData });
        setEditMode(false);
    };

    const handleSave = async () => {
        setFormData({ ...editedData });
        setEditMode(false);
        const updatedUser = await updateProfile(editedData.name, editedData.email, editedData.gender, editedData.position, editedData.location, image);
        dispatch(updateAuth(
            {
                name: updatedUser.name,
                email: updatedUser.email,
                position: updatedUser.position,
                gender: updatedUser.gender,
                location: updatedUser.location,
                profileImageUrl: updatedUser.profileImage.url
            }
        )
        )
        console.log(updatedUser.profileImage.url);
        if (!updatedUser) {
            alert("Failed to update profile.");
            return;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordMessage({ message: "New passwords do not match", status: "mismatch" })
            return;
        }
        const updatedStatus = await updatePassword(passwords.currentPassword, passwords.newPassword);
        if (updatedStatus === 200) {
            setPasswordMessage({ message: "Updated password successfully", status: "updated" })
        }
        else if (updatedStatus === 401) {
            setPasswordMessage({ message: "Incorrect password", status: "incorrect" })
        }
        else {
            setPasswordMessage({ message: "Server's error. There's something wrong", status: "error" })
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            console.log("Account deleted");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log(file);
            const tempUrl = URL.createObjectURL(file);
            setPreviewSrc(tempUrl)
            setImage(file);
        }
    }

    useEffect(() => {
        const fetchTeam = async () => {
            const team = await teamFetch(teamId);
            setTeam(team);
        }
        fetchTeam();
    }, [teamId])
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-[#181e29] p-8 rounded-2xl shadow-xl border border-[#2a2a2a]">
                <img
                    className="m-auto mb-10 w-24 h-24 rounded-full object-cover border-2 border-gray-700 shadow-lg"
                    src={previewSrc ? previewSrc : "/images/soccer-player-icon.png"}
                    alt="Team Logo"
                />
                {editMode &&
                    <div className="flex flex-col items-center mt-4">
                        <label
                            htmlFor="team-logo"
                            className="cursor-pointer bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition duration-300 hover:bg-sky-700 hover:shadow-lg active:scale-95"
                        >
                            <MdFileUpload className="text-xl" />
                            <span>Update Profile Image</span>
                        </label>
                        <input
                            type="file"
                            id="team-logo"
                            name="teamLogo"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <p className="text-sm text-gray-400 mt-2 mb-10">Supported formats: JPG, PNG, GIF</p>
                    </div>
                }

                {/* User Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                        <label className="text-sm font-bold text-white">Full Name</label>
                        <p className="mt-1 text-gray-400">{formData.name}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-white">Email</label>
                        <p className="mt-1 text-gray-400">{formData.email}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-white">Gender</label>
                        <p className="mt-1 text-gray-400">{formData.gender}</p>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-white">Position</label>
                        {editMode ? (
                            <select
                                name="position"
                                value={editedData.position}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-[#101010] text-white border border-[#333] focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            >
                                <option value="Forward">Forward</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Defender">Defender</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                            </select>
                        ) : (
                            <p className="mt-1 text-white">{formData.position}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-white font-bold">Location</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="location"
                                value={editedData.location}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-[#101010] text-white border border-[#333] focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        ) : (
                            <p className="mt-1 text-white">{formData.location}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-white font-bold">Team Name</label>
                        <p className="mt-1 text-gray-400">{team?.name || "No Team"}</p>
                    </div>
                </div>

                {/* Profile Buttons */}
                <div className="flex justify-end space-x-3 mb-12">
                    {editMode ? (
                        <>
                            <button onClick={handleCancel} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 transition">Save Changes</button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 transition">Edit Profile</button>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-white">Change Password</h2>
                    <div className="space-y-4">
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            className={`${passwordMessage.status === "incorrect" && "ring-2 ring-red-600"} w-full p-2 rounded-md bg-[#101010] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                        />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            className={`${passwordMessage.status === "mismatch" && "ring-2 ring-red-600"} w-full p-2 rounded-md bg-[#101010] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`${passwordMessage.status === "mismatch" && "ring-2 ring-red-600"} w-full p-2 rounded-md bg-[#101010] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={handlePasswordSubmit} className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 transition">Save Password</button>
                    </div>
                    <p className={`${passwordMessage.status === "error" || passwordMessage.status === "incorrect" || passwordMessage.status === "mismatch" ? "text-red-600" : "text-green-500"}`}>{passwordMessage.message}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
