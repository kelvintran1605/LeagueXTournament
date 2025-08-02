import { IoIosPersonAdd } from "react-icons/io";
import { RiCalendarEventLine } from "react-icons/ri";
import { CiSettings } from "react-icons/ci";
import { MdGroups2, MdAssistantPhoto } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import { useEffect, useState } from "react";
import { getGamesPlayedByTeam, getUpcomingMatchesByTeamId, teamFetch } from "../api/team";
import { useSelector } from 'react-redux';
import { FaLocationDot } from "react-icons/fa6";
import RequestsSection from "../components/RequestsSection";
import { TbUserQuestion } from "react-icons/tb";
import InviteSection from "../components/InviteSection";
import { getAllRequestsByTeamId } from "../api/request";
import NoTeam from "./NoTeam";
import { getAllInvitationsByTeamId } from "../api/invitation";
import { useNavigate } from "react-router-dom";
import { IoPersonRemove } from "react-icons/io5";
import { removePlayer } from "../api/team";
import { FaExclamation } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { getChampionshipsByTeam } from "../api/tournament";
import ChampionshipsWon from "../components/ChampionshipsWon";

const Team = () => {
    const navigate = useNavigate();
    const [userRequests, setUserRequests] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const { _id, teamId } = useSelector(state => state.auth);
    const [team, setTeam] = useState();
    const [requestOpened, setRequestOpened] = useState(false);
    const [inviteOpened, setInviteOpened] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState("");
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const pendingInvitations = invitations?.filter(inv => inv.status === "pending");
    const pendingRequests = userRequests?.filter(req => req.status === "pending");
    const [gamesPlayed, setGamesPlayed] = useState();
    const hasNotifications = pendingInvitations.length > 0 || pendingRequests.length > 0;
    const [championships, setChampionships] = useState([]);

    const colorMap = {
        red: "bg-red-700 text-white",
        green: "bg-green-700 text-white",
        yellow: "bg-yellow-600 text-white",
        gray: "bg-gray-700 text-white",
    };

    const handleRemove = async (userId) => {
        const status = await removePlayer(userId, teamId);
        if (status === 200) {
            setTeam(prev => ({
                ...prev,
                playerIds: prev.playerIds.filter(player => player._id !== userId)
            }));
            if (team?.captainId === _id) {
                setOpenDelete(false);
                alert("Deleted player successfully");
            }
            else {
                navigate("/user-dashboard/browse-team");
            }
        }
        else {
            alert("Error deleting player");
        }
    }

    useEffect(() => {
        if (teamId) {
            const fetchTeam = async () => {
                const data = await teamFetch(teamId);
                setTeam(data);
            };

            const fetchRequests = async () => {
                const userRequests = await getAllRequestsByTeamId(teamId);
                console.log(userRequests);
                setUserRequests(userRequests);
            };

            const fetchInvitations = async () => {
                const invitations = await getAllInvitationsByTeamId(teamId);
                console.log(invitations);
                setInvitations(invitations);
            };

            const fetchUpcomingMatches = async () => {
                const upcomingMatches = await getUpcomingMatchesByTeamId(teamId);
                setUpcomingMatches(upcomingMatches);
            }

            const getGamesPlayed = async () => {
                const gamesPlayed = await getGamesPlayedByTeam(teamId);
                setGamesPlayed(gamesPlayed);
            }

            const getChampionships = async () => {
                const championships = await getChampionshipsByTeam(teamId);
                console.log(championships);
                setChampionships(championships);
            }

            getChampionships();
            getGamesPlayed();
            fetchTeam();
            fetchRequests();
            fetchInvitations();
            fetchUpcomingMatches();
        }
    }, [teamId]);

    if (!teamId) return <div className="relative h-screen bg-gray-900"><NoTeam /></div>;

    const isCaptain = team?.captainId === _id;

    return (
        <main className="relative text-white px-6 bg-gray-900 min-h-screen">
            {requestOpened && !inviteOpened && (
                <RequestsSection
                    team={team}
                    invitations={invitations}
                    setInvitations={setInvitations}
                    setUserRequests={setUserRequests}
                    setTeam={setTeam}
                    userRequests={userRequests}
                    isOpened={requestOpened}
                    setIsOpened={setRequestOpened}
                />
            )}
            {inviteOpened && !requestOpened && (
                <InviteSection isOpened={inviteOpened} setInvitations={setInvitations} setIsOpened={setInviteOpened} />
            )}

            {/* Header */}
            <div className="w-full flex flex-col items-center text-center gap-2 py-6 px-4 bg-[#181e29] rounded-xl shadow-md border border-gray-700">
                <img
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 shadow-md"
                    src={team?.teamLogo?.url || "/images/default-logo.png"}
                    alt="Team Logo"
                />
                <h1 className="font-bold text-2xl text-white tracking-wide">{team?.name || "Unnamed Team"}</h1>
                <p className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaLocationDot className="text-lg text-gray-500" />
                    {team?.location || "No location specified"}
                </p>
                {team?.description && <p className="max-w-xl text-white text-sm mt-2 opacity-90">{team.description}</p>}
                {team?.contactEmail && (
                    <p className="max-w-xl text-gray-300 text-sm mt-1">
                        <span className="font-semibold text-gray-400">Contact Email:</span> {team.contactEmail}
                    </p>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full mt-8">
                {/* Main Section */}
                <div className="lg:w-3/4 w-full bg-[#181e29] p-5 rounded-xl border border-gray-700">
                    <div className="relative flex flex-wrap gap-4">
                        {isCaptain ? <>
                            <button onClick={() => { setInviteOpened(true); setRequestOpened(false); }} className="font-semibold p-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <IoIosPersonAdd className="text-[1.3rem]" /> Invite a Player
                            </button>
                            <div className="relative">
                                {hasNotifications &&
                                    <div className="absolute text-white bg-red-500 rounded-full p-[0.2rem] top-0 transform translate-x-2 -translate-y-2 right-0"><FaExclamation /></div>
                                }
                                <button onClick={() => { setRequestOpened(true); setInviteOpened(false); }} className="font-semibold p-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2">
                                    <TbUserQuestion className="text-[1.3rem]" /> Requests
                                </button>
                            </div>
                            <button onClick={() => navigate("/user-dashboard/team-settings")} className="font-bold px-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2">
                                <CiSettings className="text-[1.3rem]" /> Edit Team
                            </button>
                        </>
                            :
                            <button
                                onClick={() => { setPlayerToDelete(_id); setOpenDelete(true) }}
                                className="absolute right-0 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 transition duration-300 active:scale-95"
                            >
                                <FiLogOut className="text-xl" />
                                Exit Team
                            </button>}
                    </div>

                    {/* Squad */}
                    <div className="font-bold flex flex-col gap-4 mt-16 w-full bg-gray-800 rounded-xl py-8 px-4">
                        <div className="flex justify-between items-center">
                            <h2 className="flex items-center gap-2 text-[1.3rem]">
                                <MdGroups2 className="text-[2rem] text-sky-500" /> Squad Members
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-4">
                            {openDelete && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-600 w-[90%] max-w-md">
                                        <p className="mb-4 text-white">
                                            {_id === team?.captainId ? "Are you sure you want to remove this player?" : "Are you sure you want to leave the team?"}
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => setOpenDelete(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>
                                            <button onClick={() => handleRemove(playerToDelete)} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {team?.playerIds.map((member, index) => (
                                <div key={index} className="w-full md:w-[48%] flex items-center p-3 h-[6rem] border border-gray-700 rounded-xl bg-gray-800 hover:shadow-lg transition">
                                    <img className="w-[4rem] h-[4rem] rounded-full object-cover" src={member.profileImage?.url || "/images/soccer-player-icon.png"} />
                                    <div className="ml-4 w-full">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-white/90">{member.name}</h3>
                                            {member._id === team.captainId && (
                                                <div className="text-black font-bold rounded-xl px-2 bg-yellow-500">Captain</div>
                                            )}
                                        </div>
                                        <div className="text-sky-400 text-sm">{member.position}</div>
                                        <div className="text-gray-400 text-sm">{member.email}</div>
                                    </div>
                                    {_id === team.captainId && member._id !== team.captainId &&
                                        <button onClick={() => { setOpenDelete(true); setPlayerToDelete(member._id) }} className="font-normal flex gap-2 items-center text-red-400 hover:cursor-pointer hover:font-bold">
                                            <IoPersonRemove className="mr-4 text-[1.3rem] hover:text-red-500 duration-250 transition" />
                                        </button>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fixtures */}
                    <div className="font-bold flex flex-col gap-4 mt-10 bg-gray-800 rounded-xl p-8">
                        <div className="flex items-center gap-2 text-lg">
                            <RiCalendarEventLine className="text-teal-400 text-xl" />
                            <h2>Next Match</h2>
                        </div>

                        {upcomingMatches ? upcomingMatches.map((match, idx) => (
                            <div key={idx} className="bg-gray-800 rounded-lg p-4 flex gap-4 items-start border border-gray-600">
                                <div className="bg-gray-900 rounded-md px-3 py-2 text-center font-bold">
                                    <p className="text-sm text-gray-300">{new Date(match.date).toLocaleString("en-US", { month: "short" }).toUpperCase()}</p>
                                    <p className="text-xl text-white leading-tight">{new Date(match.date).getDate()}</p>
                                </div>
                                <div className="flex flex-col flex-1 gap-2">
                                    <p className="font-semibold text-white">vs {match.teamA._id === teamId ? match.teamB.name : match.teamA.name}</p>
                                    <p className="text-sm text-gray-300">{match.field} • {match.location}</p>
                                </div>
                                <div className="flex flex-col items-end text-right text-sm">
                                    <span className="text-indigo-400 font-bold">{match.tournamentId.name}</span>
                                    <span className="text-gray-300">{match.round === 1 ? "Quarterfinals" : match.round === 2 ? "Semifinals" : "Final"}</span>
                                </div>
                            </div>
                        ))
                            :
                            <p className="text-gray-400">
                                You don't have any upcoming matches
                            </p>
                        }
                    </div>

                    <ChampionshipsWon championships={championships} />
                </div>

                {/* Stats Section */}
                <div className="lg:w-1/4 w-full bg-[#181e29] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <ImStatsDots className="text-sky-500" />
                        Team Statistics
                    </h2>

                    <div className="flex flex-col gap-6">
                        {/* Stat Card */}
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-md hover:shadow-lg transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-700 p-3 rounded-full">
                                    <MdOutlineSportsSoccer className="text-white text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-400">Games Played</p>
                                    <p className="text-2xl font-bold text-white">{gamesPlayed ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card */}
                        <div className="bg-gray-800 rounded-xl border border-indigo-700 p-5 shadow-md hover:shadow-lg transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-700 p-3 rounded-full">
                                    <FaTrophy className="text-white text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-indigo-100">Championships Won</p>
                                    <p className="text-2xl font-bold text-white">{championships?.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default Team;