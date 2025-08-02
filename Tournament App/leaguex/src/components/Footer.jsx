import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#0C172B] text-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo or Brand Name */}
                <div className="text-xl font-bold">LeagueX</div>

                {/* Social Links */}
                <div className="flex gap-4">
                    <a
                        href="https://www.facebook.com/angkhoa.682122"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition"
                    >
                        <FaFacebookF size={20} />
                    </a>
                    <a
                        href="https://www.instagram.com/_ktr1605/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition"
                    >
                        <FaInstagram size={20} />
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-sm text-gray-300 text-center md:text-right">
                    © {new Date().getFullYear()} LeagueX. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
