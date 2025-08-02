import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Nav = () => {
    const navigate = useNavigate();
    const handleGoToLogin = () => {
        navigate("/login");
    }
    const handleGoToSignUp = () => {
        navigate("/create-account");
    }

    return (
        <header>
            <nav className="font-heading font relative flex justify-between items-center h-20">
                <NavLink to="/">
                    <img className="w-[8rem] h-[6rem] object-contain" src="/images/logo2.png" alt="Logo" />
                </NavLink>

                <ul className="hidden new:flex gap-2 mr-5 items-center">
                    <li>
                        <button onClick={handleGoToLogin} className="text-base sm:w-[90px] transition duration-150 hover:bg-gray-100/90 border-solid border-2  border-blue-600 text-blue-600 font-semibold rounded-3xl w-[100px] h-[40px]">
                            Login
                        </button>
                    </li>
                    <li>
                        <button onClick={handleGoToSignUp} className="text-base sm:w-[90px] bg-blue-700 transition duration-150 hover:bg-blue-500/90 text-white font-semibold rounded-3xl w-[100px] h-[40px]">
                            Join Us
                        </button>
                    </li>
                </ul>
                {/* <IoMdMenu onClick={handleOpen} className="new:hidden text-[3.5rem] mr-[12px] rounded-full hover:bg-gray-200 p-2 hover:cursor-pointer" /> */}
            </nav>
        </header >
    );
};

export default Nav;
