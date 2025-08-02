import React, { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { useSelector } from "react-redux";
import { advanceToNextRound, completeTournament, joinTournament, leaveTournament, removeTeamFromTournament, startTournament } from "../api/tournament";
import { getAllTournaments } from "../api/tournament";
import { IoIosRemoveCircle } from "react-icons/io";
import { useState } from "react";
import { FaPlay } from 'react-icons/fa';
import QuarterfinalMatches from "../components/QuarterFinalMatches";
import { getMatchesByCurrentRound, updateMatchResult } from "../api/match";
export default function TournamentDetail({ setJoinedTournament, setCurrentTournament, setTournamentDetailMode, selectedTournament, setSelectedTournament, tournaments, setTournaments }) {
    const { role, teamId } = useSelector(state => state.auth);
    const [deleteMode, setDeleteMode] = useState(false);
    const [deletedTeam, setDeletedTeam] = useState(null);
    const [selectedMatchIndex, setSelectedMatchIndex] = useState("");
    const [matches, setMatches] = useState([]);
    const [teamAScore, setTeamAScore] = useState("");
    const [teamBScore, setTeamBScore] = useState("");
    const [champion, setChampion] = useState(selectedTournament.winner);
    const statusColors = {
        waiting: "bg-yellow-500",
        ready: "bg-blue-500",
        ongoing: "bg-green-500",
        finished: "bg-gray-600",
        canceled: "bg-red-500",
    };

    const handleJoin = async (tournamentId) => {
        const updatedTournament = await joinTournament(tournamentId);

        if (updatedTournament) {
            setSelectedTournament(updatedTournament);

            const updatedTournaments = await getAllTournaments();
            setCurrentTournament(updatedTournament);
            setTournaments(updatedTournaments);
        }
    }

    const handleLeave = async () => {
        const updatedTournament = await leaveTournament();

        if (updatedTournament) {
            setTournamentDetailMode(false);

            const updatedTournaments = await getAllTournaments();
            setTournaments(updatedTournaments);
            setCurrentTournament(null);

        }
    };

    const handleRemoveTeam = async (teamId, tournamentId) => {
        const removedTeam = await removeTeamFromTournament(teamId, tournamentId);
        if (removedTeam) {
            const updatedTeams = selectedTournament.teamIds.filter(team => team._id !== teamId);
            setSelectedTournament(prev => ({
                ...prev,
                teamIds: updatedTeams
            }));
            setDeleteMode(false);
        }
    }

    const handleStartTournament = async (tournamentId) => {
        const updatedTournament = await startTournament(tournamentId);
        if (updatedTournament) {
            setSelectedTournament(updatedTournament);
        }
    }

    const handleUpdateScore = async (selectedMatchIndex, score) => {
        const res = await updateMatchResult(selectedMatchIndex, score);
        if (res) {
            const data = await getMatchesByCurrentRound(selectedTournament._id);
            setMatches(data);
            setSelectedMatchIndex("");
            setTeamAScore("");
            setTeamBScore("");
        }
    }

    const handleAdvanceNextRound = async (tournamentId) => {
        const res = await advanceToNextRound(tournamentId);
        if (res) {
            const updatedTournaments = await getAllTournaments();
            const updated = updatedTournaments.find(t => t._id === tournamentId);

            if (updated) {
                setSelectedTournament(updated);

                const data = await getMatchesByCurrentRound(updated._id);
                setMatches(data);
            }
        }
    }

    const handleCompleteTournament = async (tournamentId) => {
        const res = await completeTournament(tournamentId);
        if (res) {
            setSelectedTournament(res.updatedTournament);
            setChampion(res.champion);
        }
    }

    useEffect(() => {
        console.log(selectedTournament.status);
        const fetchMatches = async () => {
            const data = await getMatchesByCurrentRound(selectedTournament._id);
            setMatches(data);
        }
        fetchMatches();

    }, [selectedTournament]);

    if (!selectedTournament) return <div className="text-white px-8">Loading tournament...</div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen px-8 py-6 relative">
            <button
                onClick={() => setTournamentDetailMode(false)}
                className="mb-6 inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm transition duration-300 ease-in-out"
            >
                <AiOutlineArrowLeft className="w-4 h-4" />
                Back
            </button>
            {/* Header */}
            <div className="flex items-center gap-8">
                <h1 className="text-3xl font-bold mb-2">{selectedTournament.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[selectedTournament.status]}`}>
                    {selectedTournament.status?.charAt(0).toUpperCase() + selectedTournament.status?.slice(1)}
                </span>
            </div>


            <p className="text-gray-400 mb-6 max-w-2xl">
                {selectedTournament.description}
            </p>

            {/* Tournament Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Number of Teams</p>
                    <p className="text-2xl font-bold">{selectedTournament?.teamIds?.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Max Teams</p>
                    <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Tournament Type</p>
                    <p className="text-2xl font-bold">Quarterfinals</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Start Date</p>
                    <p className="text-2xl font-bold">  {new Date(selectedTournament?.roundStartDates?.[0]).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Participants */}
            <h2 className="text-2xl text-sky-500 font-semibold mb-8">Participants</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mb-16">
                {[...(selectedTournament?.teamIds || []),
                ...Array((selectedTournament?.maxTeams || 8) - (selectedTournament?.teamIds?.length || 0))
                ].map((team, idx) => (
                    <div
                        key={idx}
                        className="bg-gray-800/60 hover:bg-gray-700/80 rounded-2xl shadow-md transition-all duration-300 flex flex-col items-center py-6 px-4 text-center group"
                    >
                        {team?._id ? (
                            <>
                                <img
                                    src={team.teamLogo?.url}
                                    alt={team.name}
                                    className="w-24 h-24 object-cover rounded-full border-4 border-sky-500 mb-3 group-hover:scale-105 transition-transform"
                                />
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg font-semibold text-white">{team.name}</span>
                                    {role === "admin" && selectedTournament.status === "ready" && (
                                        <IoIosRemoveCircle
                                            onClick={() => {
                                                setDeleteMode(true);
                                                setDeletedTeam(team);
                                            }}
                                            className="text-red-500 text-[1.3rem] hover:scale-110 transition-transform cursor-pointer"
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl text-gray-400 mb-3">
                                    ?
                                </div>
                                <span className="text-gray-500 text-sm font-medium italic">Waiting for team...</span>
                            </>
                        )}
                    </div>
                ))}
            </div>


            {/* Match Schedule */}
            <div className="flex items-start flex-wrap gap-7">
                <div className="w-1/5">
                    {/* Location */}
                    <h2 className="text-2xl text-sky-500 font-semibold mb-10">Location & Field</h2>
                    <p className="text-gray-300">{selectedTournament.field}</p>
                    <p className="text-gray-300 mb-4">{selectedTournament.location}</p>
                    <h2 className="text-2xl text-sky-500 relative font-semibold mb-10 mt-16">Match Schedule</h2>
                    <div className="relative border-l border-gray-600 pl-6 space-y-16">

                        {/* Quarterfinals */}
                        <div className="relative">
                            <div className={`${selectedTournament.currentRound >= 1 && "bg-green-600"} absolute -left-10 top-1 text-white bg-gray-800 p-1 rounded-full border border-gray-500`}>
                                <MdOutlineSportsSoccer size={24} />
                            </div>
                            <p className="text-xl ml-4 font-semibold">Quarterfinals</p>
                            <p className="text-sm ml-4 text-gray-400">{new Date(selectedTournament?.roundStartDates?.[0]).toLocaleString()}</p>
                        </div>

                        {/* Semifinals */}
                        <div className="relative">
                            <div className={`absolute ${selectedTournament.currentRound >= 2 && "bg-green-600"} -left-10 top-1 text-white bg-gray-800 p-1 rounded-full border border-gray-500`}>
                                <MdOutlineSportsSoccer size={24} />
                            </div>
                            <p className="text-xl ml-4 font-semibold">Semifinals</p>
                            <p className="text-sm ml-4 text-gray-400">{new Date(selectedTournament?.roundStartDates?.[1]).toLocaleString()}</p>
                        </div>

                        {/* Final */}
                        <div className="relative">
                            <div className={`${selectedTournament.currentRound >= 3 && "bg-green-600"} absolute -left-10 top-1 text-white bg-gray-800 p-1 rounded-full border border-gray-500`}>
                                <FaTrophy size={24} />
                            </div>
                            <p className="text-xl ml-4 font-semibold">Final</p>
                            <p className="text-sm ml-4 text-gray-400">{new Date(selectedTournament?.roundStartDates?.[2]).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                {selectedTournament && selectedTournament.currentRound >= 1 && selectedTournament.status === "ongoing" &&
                    <QuarterfinalMatches matches={matches} />
                }
                {
                    selectedTournament && selectedTournament.status === "finished" && champion &&
                    <div className="flex justify-center items-center h-full w-3/4 m-auto">
                        <div className="relative rounded-full w-96 h-96 flex items-center justify-center shadow-[0_0_30px_#A3FF12] border-4 border-lime-400 bg-[#121212]">
                            {/* Glowing circle border */}
                            <div className="absolute inset-0 rounded-full border-4 border-lime-400 animate-pulse shadow-[0_0_40px_#A3FF12]"></div>

                            {/* Logo and team info */}
                            <div className="flex flex-col items-center z-10">
                                <img
                                    src={champion.teamLogo?.url || "/fallback-logo.png"}
                                    alt="Team Logo"
                                    className="w-24 h-24 object-contain mb-4"
                                />
                                <h1 className="text-white font-semibold text-3xl">{champion.name}</h1>
                                <p className="text-yellow-400 text-sm mt-3 tracking-wide">TOURNAMENT WINNER</p>

                            </div>
                        </div>
                    </div>
                }
            </div>

            {/* Admin Panel */}
            {role === "admin" ?
                (selectedTournament.status === "ready" || selectedTournament.status === "waiting" ?
                    <div className="border-t mt-8 border-gray-700 pt-6">
                        <button onClick={() => handleStartTournament(selectedTournament._id)} className={`flex items-center gap-2 px-5 py-2 bg-yellow-600 hover:bg-yellow-700 duration-250 rounded-2xl text-white font-semibold shadow-md transition`}>
                            <FaPlay />
                            Start Tournament
                        </button>
                    </div>
                    :
                    selectedTournament.status === "ongoing" ?
                        <div className="border-t mt-8 border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Admin – Enter Match Results</h3>
                            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                                <select
                                    onChange={(e) => setSelectedMatchIndex(e.target.value)}
                                    value={selectedMatchIndex || ""}
                                    className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded">

                                    <option value="">Select Match</option>
                                    {matches.filter(match => match.status === "scheduled").map((match) => (
                                        <option key={match._id} value={match._id}>{match.teamA.name} vs {match.teamB.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={teamAScore}
                                    onChange={(e) => setTeamAScore(e.target.value)}
                                    placeholder="Team A Score"
                                    className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
                                />
                                <input
                                    type="text"
                                    value={teamBScore}
                                    onChange={(e) => setTeamBScore(e.target.value)}
                                    placeholder="Team B Score"
                                    className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
                                />

                                {matches.every(match => match.status === "completed") ?
                                    (
                                        selectedTournament.currentRound === 3 ?
                                            <button onClick={() => handleCompleteTournament(selectedTournament._id)} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
                                                Finish Tournament
                                            </button>
                                            :
                                            <button onClick={() => handleAdvanceNextRound(selectedTournament._id)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded">
                                                Next Round
                                            </button>
                                    )
                                    :
                                    <button onClick={() => handleUpdateScore(selectedMatchIndex, teamAScore + "-" + teamBScore)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
                                        Submit Results
                                    </button>
                                }

                            </div>
                        </div> :
                        selectedTournament.status === "finished" &&
                        <div className="border-t mt-8 border-gray-700 pt-6 text-red-500">
                            This tournament has concluded.
                        </div>)
                :
                selectedTournament.status === "waiting" ?
                    (selectedTournament.teamIds?.some(team => team._id === teamId) ?
                        <div className="border-t mt-8 border-gray-700 pt-6">
                            <button onClick={handleLeave} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded">
                                Leave Tournament
                            </button>
                        </div> :
                        <div className="border-t mt-8 border-gray-700 pt-6">
                            <button onClick={() => handleJoin(selectedTournament._id)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
                                Join Tournament
                            </button>
                        </div>
                    ) : selectedTournament.status === "ongoing" ?
                        <div className="border-t mt-8 border-gray-700 pt-6 text-yellow-600">
                            This tournament is already in progress and no longer accepting new participants. Please consider joining a different tournament.
                        </div>
                        : selectedTournament.status === "finished" &&
                        <div className="border-t mt-8 border-gray-700 pt-6 text-red-500">
                            This tournament has concluded.
                        </div>
            }

            {/* Delete box confirmation */}
            {
                deleteMode &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h2>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <span className="font-extrabold text-red-400">{deletedTeam?.name}</span> from the tournament? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteMode(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRemoveTeam(deletedTeam?._id, selectedTournament._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}
