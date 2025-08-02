import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { teamFetch, updateTeam } from "../api/team.js";
import { useNavigate } from "react-router-dom";
const TeamSettings = () => {
    const navigate = useNavigate();
    const { teamId } = useSelector(state => state.auth);
    const [teamLogo, setTeamLogo] = useState();
    const [teamLogoFile, setTeamLogoFile] = useState(null);
    const [teamName, setTeamName] = useState("FC Strikers");
    const [teamLocation, setTeamLocation] = useState("New York, NY");
    const [teamDescription, setTeamDescription] = useState("FC Strikers is a competitive soccer team founded in 2020. We focus on developing young talent while maintaining a competitive edge in local tournaments.");
    const [contactEmail, setContactEmail] = useState("contact@fcstrikers.com");

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTeamLogo(URL.createObjectURL(file));
            setTeamLogoFile(file);
        }
    };

    const handleUpdate = async () => {
        console.log(teamId, teamLogoFile, teamName, teamDescription, teamLocation, contactEmail);
        const status = await updateTeam(teamId, teamLogoFile, teamName, teamDescription, teamLocation, contactEmail);
        console.log(status);
        if (status === 200) {
            navigate("/user-dashboard/team");
        }
    }

    useEffect(() => {
        const fetchTeam = async () => {
            if (teamId) {
                const team = await teamFetch(teamId);
                setTeamLogo(team.teamLogo.url);
                setTeamName(team.name);
                setTeamLocation(team.location);
                setTeamDescription(team.description);
                setContactEmail(team.contactEmail);
            }
        }
        fetchTeam();
    }, [])
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold">Team Settings</h1>
                <div className="flex gap-3">
                    <button onClick={() => navigate("/user-dashboard/team")} className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700">Cancel</button>
                    <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2">
                        <FaUpload />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo upload */}
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <h2 className="text-lg font-semibold mb-4">Team Logo</h2>
                    <div className="flex justify-center mb-4">
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                            {teamLogo ? (
                                <img src={teamLogo} alt="Team Logo" className="object-cover w-full h-full rounded-full" />
                            ) : (
                                <span className="text-gray-400 text-4xl">🛡️</span>
                            )}
                        </div>
                    </div>
                    <label className="cursor-pointer">
                        <div className="border border-gray-500 px-4 py-2 rounded-md inline-flex items-center gap-2 hover:bg-gray-700">
                            <FaUpload />
                            Upload Logo
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                        />
                    </label>
                    <p className="text-sm text-gray-400 mt-2">Recommended: 512×512px, PNG or JPG</p>
                </div>

                {/* Team info */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Team Information</h2>
                    <div className="mb-4">
                        <label className="text-sm text-gray-300 mb-1 block">Team Name <span className="text-red-400">(required)</span></label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-300 mb-1 block">Team Location</label>
                        <input
                            type="text"
                            value={teamLocation}
                            onChange={(e) => setTeamLocation(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-300 mb-1 block">Team Description</label>
                        <textarea
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                            rows={4}
                            className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Contact Email <span className="text-red-400">(required)</span></label>
                        <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamSettings;