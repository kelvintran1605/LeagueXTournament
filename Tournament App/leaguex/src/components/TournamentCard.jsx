import { FaUsers } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";

export default function TournamentCard({ tournament, handleDelete, isAdmin, setTournamentDetailMode, setSelectedTournament }) {
    const statusColors = {
        waiting: "bg-yellow-500",
        ready: "bg-blue-500",
        ongoing: "bg-green-500",
        finished: "bg-gray-600",
        canceled: "bg-red-500",
    };

    const full = tournament.teamIds?.length === tournament.maxTeams;

    return (
        <div
            onClick={() => {
                setTournamentDetailMode(true);
                setSelectedTournament(tournament);
            }}
            className="hover:cursor-pointer hover:bg-gray-800 transition duration-250 bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl hover:shadow-2xl"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold truncate max-w-[70%]">{tournament.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[tournament?.status]}`}>
                    {tournament.status?.charAt(0).toUpperCase() + tournament.status?.slice(1)}
                </span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{tournament.description || "No description provided."}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FaUsers className="text-lg" />
                    <span className={full ? "text-green-400 font-semibold" : ""}>
                        {tournament.teamIds?.length}/{tournament.maxTeams} teams
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MdOutlineSportsSoccer className="text-lg" />
                    <span>{tournament.field || "No field"}</span>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-sm text-gray-400 mt-4">Location: {tournament.location || "Unknown"}</p>
                    <p className="text-xs text-gray-500 mt-1">Start: {new Date(tournament?.roundStartDates?.[0]).toLocaleString()}</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(tournament._id);
                        }}
                        className="bg-red-600 p-[4px] rounded-sm hover:bg-red-700"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
