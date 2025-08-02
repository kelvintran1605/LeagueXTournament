import React from "react";

const championships = [
    {
        title: "National Championship",
        year: "2022",
        location: "Los Angeles",
        image: "/images/trophy1.png"
    },
    {
        title: "Regional Tournament",
        year: "2021",
        location: "San Francisco",
        image: "/images/trophy2.png"
    },
    {
        title: "State Cup",
        year: "2020",
        location: "Sacramento",
        image: "/images/trophy3.png"
    },
    {
        title: "City League",
        year: "2019",
        location: "Oakland",
        image: "/images/trophy4.png"
    }
];

export default function ChampionshipsWon({ championships }) {
    return (
        <div className="bg-gray-800 mt-8 rounded-md text-white py-12 px-6">
            <h1 className="text-3xl font-extrabold mb-10 text-white flex items-center gap-2">
                Championships Won
            </h1>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {championships && championships.length > 0 ? championships.map((c, index) => (
                    <div
                        key={index}
                        className="hover:cursor-pointer bg-gray-600 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
                    >
                        <div className="relative">
                            <img
                                src="/images/trophy.jpg"
                                alt={c.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-yellow-400 p-2 rounded-full shadow-md">
                                🏆
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-bold">{c.name}</h2>
                            <p className="text-sm text-gray-300">{new Date(c.roundStartDates[0]).getFullYear()}</p>
                            <p className="text-sm text-gray-300">{c.location}</p>
                        </div>
                    </div>
                ))
                    : <p className="text-gray-200 w-[30rem]">No trophies yet — but the next one could be yours!</p>
                }
            </div>
        </div>
    );
}
