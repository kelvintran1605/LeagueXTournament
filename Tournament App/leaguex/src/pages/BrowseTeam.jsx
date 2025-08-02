import { FaUserGroup } from "react-icons/fa6";
import { GiDiamondTrophy } from "react-icons/gi";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAllTeams, getChampionshipsGroupedByTeam } from '../api/team.js';
import { FaSearch, FaTimes } from "react-icons/fa";
import { createRequest, getAllRequestsByUserId, deleteRequest } from "../api/request.js";
import { useSelector } from 'react-redux';
import { acceptInvitation, declineInvitation, getAllInvitationsByUserId } from "../api/invitation.js";
const BrowseTeam = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [appliedTeams, setAppliedTeams] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState("");
    const [isRequestOpened, setIsRequestOpened] = useState(false);
    const [isInvitationOpened, setIsInvitationOpened] = useState(false);
    const [championshipsByTeam, setChampionshipsByTeam] = useState({});

    const { teamId } = useSelector(state => state.auth);
    const hasTeam = teamId && teamId.trim() !== "";
    const handleFilter = (e) => {
        setFilteredTeam(e.target.value);
    }

    const handleDecline = async (teamId) => {
        const status = await declineInvitation(teamId);
        if (status === 200) {
            const updatedInvitations = invitations.filter(invitation => invitation.teamId._id !== teamId);
            setInvitations(updatedInvitations);
        }
        else {
            console.log(status);
        }
    }

    const handleRequest = async (teamId) => {
        if (!hasTeam) {
            await createRequest(teamId);
            const teamObj = teams.find(t => t._id === teamId);
            if (teamObj) {
                setAppliedTeams(prev => [...prev, teamObj]);
            }
        }
        else {
            alert("You already had a team!");
        }

    }

    const handleCancel = async (teamId) => {
        const isDeleted = await deleteRequest(teamId);
        if (isDeleted) {
            const updatedRequests = appliedTeams.filter(team => team._id !== teamId);
            setAppliedTeams(updatedRequests);
            alert("Request canceled successfully!");
        }
    }

    const handleAccept = async (teamId) => {
        const status = await acceptInvitation(teamId);
        if (status === 200) {
            setInvitations(prev => prev.filter(invitation => invitation.teamId._id !== teamId));
            alert("Invitation accepted, navigating to your new team...");
            navigate("/user-dashboard/team");
        }
        else if (status === 400) {
            alert("User already in team");
        }
    }
    useEffect(() => {
        const getTeams = async () => {
            const allTeams = await getAllTeams();
            const res = await getChampionshipsGroupedByTeam();
            if (allTeams) setTeams(allTeams);

            // map teamId -> championship count
            const grouped = {};
            res.forEach(entry => {
                grouped[entry.team._id] = entry.championships;
            });
            console.log(grouped);
            setChampionshipsByTeam(grouped);
        };

        const getRequests = async () => {
            const requests = await getAllRequestsByUserId();
            const appliedTeamList = requests.map(req => req.teamId);
            setAppliedTeams(appliedTeamList);
        };

        const getInvitations = async () => {
            const invitations = await getAllInvitationsByUserId();
            setInvitations(invitations);
        }

        getTeams();
        getInvitations();
        getRequests();
    }, []);

    if (teamId) {
        return <Navigate to="/user-dashboard/team" />
    }

    return (
        <div className="text-white w-full relative">
            {/* Search teams */}
            <div className="relative flex items-center ml-8 mt-8">
                <FaSearch className="absolute ml-2" />
                <input
                    onChange={handleFilter}
                    value={filteredTeam}
                    className="bg-gray-800 pl-8 py-2 rounded-2xl border-2 border-gray-200"
                    placeholder="Search teams..."
                />
            </div>

            {isRequestOpened && (
                <div className="absolute ap-6 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1 shadow-2xl w-full max-w-3xl h-[30rem] bg-[#353b48] p-6 flex flex-col gap-6 rounded-lg max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-[1.3rem]">Team Requests</h2>
                        <FaTimes onClick={() => setIsRequestOpened(false)} className="hover:text-red-500 transition duration-100 cursor-pointer text-xl" />
                    </div>

                    {appliedTeams.length === 0 ? (
                        <p className="text-gray-300">You haven’t applied to any teams yet.</p>
                    ) : (
                        appliedTeams.map(team => (
                            <div key={team._id} className="flex gap-4 items-center bg-gray-800 p-4 rounded-xl">
                                <img className="w-[4rem] h-[4rem] object-cover rounded-md" src={team.teamLogo.url} />
                                <div className="flex flex-col flex-grow">
                                    <span className="font-semibold text-lg">{team.name}</span>
                                    <span className="text-gray-400 text-sm">{team.location}</span>
                                </div>
                                <button onClick={() => handleCancel(team._id)} className="hover:bg-gray-500 transition duration-250 bg-gray-600 text-white text-sm px-9 py-1 rounded-full font-semibold">
                                    Cancel
                                </button>
                            </div>
                        ))
                    )}

                </div>
            )
            }

            {isInvitationOpened && (
                <div className="absolute ap-6 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1 shadow-2xl w-full max-w-3xl h-[30rem] bg-[#353b48] p-6 flex flex-col gap-6 rounded-lg max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-[1.3rem]">Invitations</h2>
                        <FaTimes onClick={() => setIsInvitationOpened(false)} className="hover:text-red-500 transition duration-100 cursor-pointer text-xl" />
                    </div>

                    {invitations.length === 0 ? (
                        <p className="text-gray-300">You don't have any invitations yet</p>
                    ) : (
                        invitations.filter(invitation => invitation.status !== "approved").map(invitation => (
                            <div key={invitation._id} className="flex gap-4 items-center bg-gray-800 p-4 rounded-xl">
                                <img className="w-[4rem] h-[4rem] object-cover rounded-md" src={invitation.teamId.teamLogo.url} />
                                <div className="flex flex-col flex-grow">
                                    <span className="font-semibold text-lg">{invitation.teamId.name}</span>
                                    <span className="text-gray-400 text-sm">{invitation.teamId.location}</span>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => handleAccept(invitation.teamId._id)} className="hover:bg-green-500 transition duration-250 bg-green-600 text-white text-sm px-9 py-1 rounded-full font-semibold">
                                        Accept
                                    </button>
                                    <button onClick={() => handleDecline(invitation.teamId._id)} className="hover:bg-red-500 transition duration-250 bg-red-600 text-white text-sm px-9 py-1 rounded-full font-semibold">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            )
            }
            <div className="flex gap-2 ml-8 mt-4">
                <div onClick={() => setIsRequestOpened(!isRequestOpened)} className="hover:text-white hover:bg-sky-600 transition duration-250 rounded-md text-sky-600 bg-white font-bold p-2 hover:cursor-pointer">
                    See pending requests
                </div>
                <div onClick={() => setIsInvitationOpened(!isInvitationOpened)} className="hover:text-white hover:bg-sky-600 transition duration-250 rounded-md text-sky-600 bg-white font-bold p-2 hover:cursor-pointer">
                    See pending invitations
                </div>
            </div>

            {/* Teams */}
            <div className="relative flex flex-wrap w-full items-center mt-8 bg-slate-900 justify-between gap-8 px-14 py-8">
                {
                    (filteredTeam ? teams.filter(team => team.name.toLowerCase().includes(filteredTeam.toLowerCase())) : teams)
                        .map(team => (
                            <div key={team._id} className="flex gap-8 items-start rounded-xl bg-gray-800 p-4">
                                <img className="w-[5rem] h-[5rem] object-cover" src={team.teamLogo.url} />
                                <div className="flex flex-col justify-center gap-3">
                                    <div className="font-bold text-[1.2rem]">{team.name}</div>
                                    <div className="text-gray-400">{team.location}</div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 bg-opacity-50 bg-green-600 py-[0.2rem] px-[0.5rem] rounded-2xl">
                                            <FaUserGroup />
                                            {team.playerIds.length} players
                                        </div>
                                        <div className="flex items-center gap-2 bg-opacity-50 bg-orange-500 py-[0.2rem] px-[0.4rem] rounded-2xl">
                                            <GiDiamondTrophy />
                                            {Array.isArray(championshipsByTeam[team._id])
                                                ? championshipsByTeam[team._id].length
                                                : 0} championships                                        </div>
                                    </div>
                                </div>
                                <div className="flex m-auto gap-4">
                                    {
                                        appliedTeams.some(applied => applied._id === team._id) ? (
                                            <button className="bg-gray-600 cursor-not-allowed rounded-md p-2" disabled>
                                                Pending...
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRequest(team._id)}
                                                className="bg-sky-500 hover:bg-sky-600 transition duration-250 rounded-md p-2"
                                            >
                                                Apply to join
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                }
            </div>
        </div >
    );
};

export default BrowseTeam;
