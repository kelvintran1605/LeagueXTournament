import React, { useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { deleteTournament, getAllTournaments } from "../api/tournament.js";
import { teamFetch } from "../api/team.js";
import CreateTournament from "./CreateTournament.jsx";
import TournamentDetail from "./TournamentDetail.jsx";
import TournamentCard from "../components/TournamentCard.jsx";
import StatusFilter from "../components/StatusFilter.jsx";

export default function BrowseTournament() {
    const { role, teamId } = useSelector(state => state.auth);
    const [tournaments, setTournaments] = useState([]);
    const [createTournamentMode, setCreateTournamentMode] = useState(false);
    const [tournamentDetailMode, setTournamentDetailMode] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [joinedTournament, setJoinedTournament] = useState([]);
    const [currentTournament, setCurrentTournament] = useState(null);
    const [selectedTab, setSelectedTab] = useState("current");
    const [selectedStatus, setSelectedStatus] = useState("All");

    useEffect(() => {
        const getTournaments = async () => {
            try {
                const tournaments = await getAllTournaments();
                setTournaments(tournaments);
                const team = await teamFetch(teamId);

                if (team) {
                    const current = tournaments.find(t => t._id === team.tournamentId);
                    const joined = tournaments.filter(t =>
                        t.teamIds?.some(teamObj => teamObj._id === teamId)
                    );
                    const otherJoined = joined.filter(t => t._id !== team.tournamentId);

                    setCurrentTournament(current);
                    setJoinedTournament(otherJoined ?? []);
                } else {
                    setCurrentTournament(null);
                    setJoinedTournament([]);
                }
            } catch (err) {
                console.error("Error fetching tournaments or team:", err);
            }
        };

        getTournaments();
    }, [teamId]);

    const statusColors = {
        waiting: "bg-yellow-500",
        ready: "bg-blue-500",
        ongoing: "bg-green-500",
        finished: "bg-gray-600",
        canceled: "bg-red-500",
    };

    const handleDelete = async (tournamentId) => {
        const deleted = await deleteTournament(tournamentId);
        if (deleted) {
            alert("Deleted tournament successfully");
            setTournaments(prev => prev.filter(t => t._id !== tournamentId));
            setJoinedTournament(prev => prev.filter(t => t._id !== tournamentId));
            if (currentTournament?._id === tournamentId) setCurrentTournament(null);
        } else {
            alert("Error deleting tournament");
        }
    };

    if (createTournamentMode) {
        return <CreateTournament setCreateTournamentMode={setCreateTournamentMode} tournaments={tournaments} setTournaments={setTournaments} />;
    }

    if (tournamentDetailMode && selectedTournament) {
        return (
            <TournamentDetail
                setCurrentTournament={setCurrentTournament}
                setJoinedTournament={setJoinedTournament}
                tournaments={tournaments}
                setTournaments={setTournaments}
                setSelectedTournament={setSelectedTournament}
                selectedTournament={selectedTournament}
                setTournamentDetailMode={setTournamentDetailMode}
            />
        );
    }

    const joinedIds = Array.isArray(joinedTournament) ? joinedTournament.map(j => j._id) : [];

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h1 className="text-3xl font-bold mb-6">All Tournaments</h1>

            {role === "user" && (
                <div>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md flex items-center gap-3 mb-5">
                        <MdInfoOutline className="text-2xl mt-1" />
                        <div className="text-sm">
                            <strong>Reminder:</strong> Each team can join only <span className="font-semibold">one tournament at a time</span>. To join another tournament, your team must cancel the current one first.
                        </div>
                    </div>

                    <h2 className="text-2xl text-sky-500 font-bold mb-6">Your Tournament</h2>
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setSelectedTab("current")}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${selectedTab === "current" ? "bg-sky-500 text-white" : "bg-gray-700 text-gray-300"}`}
                        >
                            Current Tournament
                        </button>
                        <button
                            onClick={() => setSelectedTab("joined")}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${selectedTab === "joined" ? "bg-sky-500 text-white" : "bg-gray-700 text-gray-300"}`}
                        >
                            Joined Tournament
                        </button>
                    </div>

                    {/* Current Tournament Tab */}
                    <div className="h-[201px]">
                        {selectedTab === "current" ? (
                            currentTournament ? (
                                <TournamentCard tournament={currentTournament} handleDelete={handleDelete} isAdmin={role === "admin"} setTournamentDetailMode={setTournamentDetailMode} setSelectedTournament={setSelectedTournament} />
                            ) : (
                                <p className="text-gray-400">You have not joined any tournament yet!</p>
                            )
                        ) : (
                            Array.isArray(joinedTournament) && joinedTournament.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {joinedTournament.map(tournament => (
                                        <TournamentCard key={tournament._id} tournament={tournament} handleDelete={handleDelete} isAdmin={role === "admin"} setTournamentDetailMode={setTournamentDetailMode} setSelectedTournament={setSelectedTournament} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">You have not joined any tournament yet!</p>
                            )
                        )}

                    </div>

                    <h2 className="text-2xl text-sky-500 font-bold my-6">Available Tournaments</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {role === "user" ? tournaments?.filter(t =>
                            ![currentTournament?._id, ...joinedIds].includes(t._id)
                        ).filter(t => t.status !== "finished").map(tournament => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                handleDelete={handleDelete}
                                isAdmin={false}
                                setTournamentDetailMode={setTournamentDetailMode}
                                setSelectedTournament={setSelectedTournament}
                            />
                        )) : role === "admin" ? tournaments?.filter(t =>
                            ![currentTournament?._id, ...joinedIds].includes(t._id)
                        ).map(tournament => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                handleDelete={handleDelete}
                                isAdmin={false}
                                setTournamentDetailMode={setTournamentDetailMode}
                                setSelectedTournament={setSelectedTournament}
                            />
                        )) : ""
                        }
                    </div>
                </div>
            )}

            {role === "admin" && (
                <>
                    <button
                        onClick={() => setCreateTournamentMode(true)}
                        className="mb-7 gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                    >
                        Create Tournament
                    </button>

                    <StatusFilter selected={selectedStatus} onSelect={setSelectedStatus} />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tournaments.filter(t => selectedStatus.toLowerCase() === "all" || t.status === selectedStatus.toLowerCase()).map(tournament => (
                            <TournamentCard key={tournament._id} tournament={tournament} handleDelete={handleDelete} isAdmin={true} setTournamentDetailMode={setTournamentDetailMode} setSelectedTournament={setSelectedTournament} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

