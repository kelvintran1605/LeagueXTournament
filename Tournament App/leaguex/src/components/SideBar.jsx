import { MdHome } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { FaTrophy } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { SiPremierleague } from "react-icons/si";
import { AiOutlineTeam } from "react-icons/ai";
import { IoIosSettings } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useState } from "react";
const SideBar = () => {
    const [path, setPath] = useState("/team");
    const menuElements = [{ name: "Teams", logo: <RiTeamFill />, link: "browse-team" }, { name: "Tournaments", logo: <SiPremierleague />, link: "browse-tournaments" }, { name: "Profile", logo: <FaUser />, link: "profile" }, { name: "My Team", logo: <AiOutlineTeam />, link: "team" }];
    return (
        <div className="sticky top-0 text-white h-screen px-6 w-1/5 border-1 border-gray-600 bg-[#1d2033] flex flex-col justify-between">
            <div className="flex flex-col gap-2">
                {/* Logo */}
                <div className="flex gap-2 items-center">
                    <img className="w-[6rem] h-[6rem]" src="/images/Logo2.png" />
                    <div className="font-bold text-[1.5rem]">LeagueX</div>
                </div>

                {/* Menu elements */}
                <p className="text-gray-300">MENU</p>
                {
                    menuElements.map(el => (
                        <Link to={el.link}>
                            <div onClick={() => setPath(el.link)} className={`${path === el.link && "bg-sky-500 font-bold"}hover:cursor-pointer flex gap-3 text-[1.2rem] items-center mt-2 p-2 rounded-md hover:font-extrabold transition duration-500`}>
                                <div>{el.logo}</div>
                                <div>{el.name}</div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

export default SideBar;