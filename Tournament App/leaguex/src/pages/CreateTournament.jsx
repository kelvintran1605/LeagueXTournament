import React, { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { createTournament } from "../api/tournament";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function CreateTournament({ setCreateTournamentMode, setTournaments, tournaments }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [field, setField] = useState("");

    const [rounds, setRounds] = useState([
        { date: "", time: "" },
        { date: "", time: "" },
        { date: "", time: "" },
    ]);

    const updateRoundField = (index, fieldKey, value) => {
        const updated = [...rounds];
        updated[index][fieldKey] = value;
        setRounds(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = name && description && location && field && rounds.every(r => r.date && r.time);

        if (!isValid) {
            alert("Please fill in all the fields");
        }
        else {
            const roundStartDates = rounds.map(r => new Date(`${r.date}T${r.time}`));
            const savedTournament = await createTournament(name, description, location, field, roundStartDates);
            if (savedTournament) {
                alert("Successfully created tournament");
                setTournaments([...tournaments, savedTournament]);
                setCreateTournamentMode(false);
            }
            else {
                alert("Error in creating tournament");
            }
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
            <button
                onClick={() => setCreateTournamentMode(false)}
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm transition duration-300 ease-in-out"
            >
                <AiOutlineArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="flex">

                {/* Main Content */}
                <main className="flex-1 p-12">
                    <div className="max-w-3xl mx-auto bg-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-700">
                        <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">
                            🏆 Create New Tournament
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Tournament Name */}
                            <div>
                                <label className="block text-lg font-semibold text-white">
                                    Tournament Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="e.g. LeagueX Summer Cup"
                                    className="mt-2 w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white shadow-sm placeholder-gray-400"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-lg font-semibold text-white">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional summary about the tournament..."
                                    className="mt-2 w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white shadow-sm placeholder-gray-400"
                                    rows={4}
                                ></textarea>
                            </div>

                            {/* General Location and Field */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold text-white">
                                        Tournament Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Surrey, BC"
                                        className="mt-2 w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white shadow-sm placeholder-gray-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-semibold text-white">
                                        Soccer Field <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={field}
                                        onChange={(e) => setField(e.target.value)}
                                        placeholder="e.g. Vancouver Soccer Field"
                                        className="mt-2 w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white shadow-sm placeholder-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Round Details */}
                            <div>
                                <label className="block text-lg font-semibold text-white">
                                    Round Start Details <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-6 mt-4">
                                    {rounds.map((round, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={round.date}
                                                    onChange={(e) => updateRoundField(index, "date", e.target.value)}
                                                    className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                                                    required
                                                />
                                                <CiCalendar className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                            <input
                                                type="time"
                                                value={round.time}
                                                onChange={(e) => updateRoundField(index, "time", e.target.value)}
                                                className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-sky-500 hover:bg-sky-600 transition-all duration-200 text-white font-bold text-lg py-3 px-6 rounded-xl shadow-xl tracking-wide"
                                >
                                    Create Tournament
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
