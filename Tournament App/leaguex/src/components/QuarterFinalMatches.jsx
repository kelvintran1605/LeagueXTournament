import React from "react";

export default function QuarterfinalMatches({ matches }) {

    const statusColors = {
        scheduled: "bg-yellow-400 text-black",
        completed: "bg-gray-700 text-white",
        canceled: "bg-red-500 text-white",
    };

    return (
        <div className="p-6 bg-gray-800 rounded-xl w-full lg:w-[800px] m-auto">
            <div className="space-y-4">
                {matches?.map((match, idx) => (
                    <div
                        key={idx}
                        className="bg-gray-800 rounded-xl px-6 py-12 shadow-md flex items-center justify-between"
                    >
                        {/* Team A */}
                        <div className="flex items-center gap-2">
                            <img
                                src={match.teamA?.teamLogo?.url}
                                alt={match.teamA?.name}
                                className="w-16 h-16 mr-10 object-cover rounded-full bg-gray-700"
                            />
                            <span className="w-[10rem] font-semibold">{match.teamA.name}</span>
                        </div>

                        {/* VS or Score */}
                        <div className="text-center">
                            <div className="text-xl tracking-widest font-bold text-white">
                                {match.status === "completed" ? match.score : "VS"}
                            </div>
                        </div>

                        {/* Team B */}
                        <div className="flex items-center gap-2 ml-12">
                            <span className="w-[10rem] font-semibold">{match.teamB.name}</span>
                            <img
                                src={match.teamB.teamLogo.url}
                                alt={match.teamB.name}
                                className="w-16 h-16 object-cover rounded-full bg-gray-700"
                            />
                        </div>

                        {/* Status */}
                        <span
                            className={`ml-4 text-xs px-3 py-1 rounded-full font-semibold capitalize ${statusColors[match.status]
                                }`}
                        >
                            {match.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
