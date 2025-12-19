import { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { IoMdShare } from "react-icons/io";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleShare = async () => {
    if (navigator.share) {
        try {
        await navigator.share({
            title: "Usina Guará",
            text: "Conheça os projetos da Usina Guará",
            url: window.location.href,
        });
        } catch (error) {
        console.log("Compartilhamento cancelado ou falhou", error);
        }
    } else {
        alert("Compartilhamento não suportado neste dispositivo");
    }
    };

    useEffect(() => {
        setIsMenuOpen(false);        
    }, []);

    return (
        <header>    
            <div className='flex justify-start items-center flex-col xs:flex-row py-2.5 px-5 xs:px-13 gap-2 text-sm bg-gray-700 text-gray-400'>
                <a href="https://www.instagram.com/usinaguara/" target='blank' className='cursor-pointer transition hover:text-gray-300'>Instagram @usinaguara</a>
                <span className='text-gray-500 hidden xs:block'>|</span>
                <a href="mailto:usinaguara@gmail.com" target='blank' className='cursor-pointer transition hover:text-gray-300'>usinaguara@gmail.com</a>
            </div>
            <nav className="flex items-center justify-between py-5 px-5 xs:px-13 bg-gray-900">
                <NavLink onClick={scrollToTop} to="/" className="w-12 h-12 cursor-pointer drop-shadow-md drop-shadow-transparent transition hover:drop-shadow-red-900">
                    <img src={logo} alt="logo Usina Guará"/>
                </NavLink>
                <ul className="hidden lg:flex items-center justify-center gap-8">
                    <NavLink onClick={scrollToTop} to="/sobre" className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Usina Guará</NavLink>
                    <NavLink onClick={scrollToTop} to="/projetos" className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Projetos</NavLink>
                    <NavLink onClick={scrollToTop} to="/parceiros" className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Nossos Parceiros</NavLink>
                    <a href="https://www.instagram.com/usinaguara/" target='blank' className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Instagram</a>
                </ul>
                <div className='relative flex items-center gap-4'>
                    <IoMdShare onClick={handleShare} className='hidden lg:block text-2xl text-red-500 cursor-pointer transition hover:text-red-400'/>
                    <div id="sandwich" className="lg:hidden w-9 flex items-center justify-center relative cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <div id="menu" className="flex flex-col justify-center items-center absolute w-9 h-9 z-10">
                            <input type="checkbox" id="menu-faketrigger" className="peer absolute inset-0 w-9 h-9 opacity-0 cursor-pointer z-20"/>
                            <span className="block w-9 h-1 mb-1.5 bg-white rounded transition-all duration-200 ease-in-out origin-center peer-checked:rotate-45 peer-checked:translate-y-[10px] peer-hover:bg-red-300"></span>
                            <span className="block w-9 h-1 mb-1.5 bg-white rounded transition-all duration-200 ease-in-out peer-checked:opacity-0 peer-hover:bg-red-300"></span>
                            <span className="block w-9 h-1 bg-white rounded transition-all duration-200 ease-in-out origin-center peer-checked:-rotate-45 peer-checked:-translate-y-[10px] peer-hover:bg-red-300"></span>
                        </div>
                    </div>
                </div>
            </nav>
            <div className={`absolute bg-gray-900 z-100 w-full h-screen lg:hidden ${isMenuOpen && window.innerWidth <= 1024 ? "fade_in" : "fade_out"}`}>
                <ul className="lg:hidden flex flex-col items-center justify-center gap-8">
                    <NavLink onClick={scrollToTop} to="/sobre" className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Usina Guará</NavLink>
                    <NavLink onClick={scrollToTop} to="/projetos" className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Projetos</NavLink>
                    <NavLink onClick={scrollToTop} to="/parceiros" className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Nossos Parceiros</NavLink>
                    <a href="https://www.instagram.com/usinaguara/" target='blank' className="text-gray-400 border-b-2 border-transparent hover:text-gray-300 hover:border-gray-300 transition">Instagram</a>
                    <IoMdShare onClick={handleShare} className='lg:hidden block text-2xl text-red-500 cursor-pointer transition hover:text-red-400'/>
                </ul>
            </div>
        </header>
    );
}

export default Header;