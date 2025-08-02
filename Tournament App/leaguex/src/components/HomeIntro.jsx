import React from "react";

export default function HomeIntro() {
    return (
        <section className="relative bg-[#06090A] gap-16 text-white overflow-hidden px-6 py-16 md:flex md:items-center justify-center">
            {/* Text Section */}
            <div className="max-w-xl z-10 relative">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                    LeagueX — Your Ultimate Sports Team & Tournament Manager
                </h1>
                <p className="text-gray-300 text-lg">
                    LeagueX helps amateur and semi-pro athletes organize tournaments,
                    build teams, and track matches with ease.
                </p>
            </div>

            <img
                src="/images/Intro.png"
                alt="LeagueX App Mockup"
                className="w-[30rem] h-[25rem] relative right-24 object-cover rounded-xl"
            />
        </section>
    );
}