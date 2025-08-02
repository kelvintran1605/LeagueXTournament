import { Link } from "react-router-dom";
const HomeAbout = () => {
    return (
        <section className="flex bg-[#0C172B] text-white justify-around">
            <div className="flex flex-col items-center p-32 gap-5">
                <div className="relative flex gap-6 font-extrabold mr-auto mb-8">
                    <p>PASSIONATE</p>
                    <p>PROFESSIONAL</p>
                    <p>SOCCER</p>
                    <img className="absolute top-[-30px] right-[-30px] w-28" src="/images/Group3.svg" />
                </div>
                <h2 className="font-extrabold text-[3rem] mr-auto">WE ARE <span className="text-yellow-500">LEAGUE X</span></h2>
                <p className="mr-auto">League X is more than just an app — it’s a movement for competitive and casual players alike. We’re building the ultimate platform where athletes can join or host tournaments, find local teams, and level up through real-world matches. Whether you’re grinding to be the best or just in it for the love of the game, League X connects you with the action. Play local. Compete global. This is your arena.</p>
                <div className="mr-auto">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center border border-white text-white px-5 py-3 mt-6 font-semibold hover:bg-blue-500 hover:text-white hover:border-green-500 transition-all duration-300"
                    >
                        SEE HOW OUR APP WORKS
                        <span className="ml-2 text-xl">➜</span>
                    </Link>
                </div>
            </div>

            <img className="hidden new:block w-[800px] object-contain" src="/images/slider-friendly.webp" />
        </section>
    );
}

export default HomeAbout;