import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
const Welcome = () => {
    const [isFinished, setIsFinished] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setIsFinished(true);
        }, 12000)

        return () => clearInterval(interval);
    }, []);
    return (
        <main style={{ backgroundImage: "url('/images/stadium.jpg')" }} className="relative welcome flex flex-col items-center justify-center h-screen">
            {isFinished === false ?
                <video className="absolute z-10" muted autoPlay width={"100%"} height={"100%"}>
                    <source type="video/mp4" src="/images/Welcome.mp4" />
                    Your browser does not support the video tag.
                </video>
                : <div className="bg-white flex flex-col rounded-md h-1/2 font-semibold justify-center items-center p-8">
                    <img className="w-[8rem] h-[8rem]" src="/images/logo2.png" />
                    <h1 className="text-[#feca57] text-[1.5rem] font-bold flex flex-col justify-center items-center mb-4">Welcome To <span className="text-[2rem] tracking-[0.8rem]">LEAGUEX</span></h1>
                    <p className="w-3/4 text-[1.2rem] text-center mb-6">LeagueX is a new Soccer Tournament Platform. It helps you to create, manage, and join soccer tournaments with ease.</p>
                    <button onClick={() => navigate("/user-dashboard/team")} className="bg-[#feca57] mb-10 w-1/3 rounded-md hover:scale-95 py-2 text-white font-semibold">Get Started</button>
                </div>
            }

        </main >
    );
}

export default Welcome;