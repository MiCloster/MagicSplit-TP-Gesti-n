import React, { useState } from "react";
import { MdGroups,MdLogout } from "react-icons/md";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface Menu {
  name: string;
  link: string;
  icon: React.ElementType;
  click?: boolean;
}
const SideBar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menus: Menu[] = [
        { name:`${ auth.getUserName()}`, link: "/grupos", icon: FaUserCircle },
        { name: "Grupos", link: "/grupos", icon: MdGroups },
        { name: "Historial", link: "/historial", icon: AiOutlineUnorderedList },
        { name: "Cerrar Sesión", link: "/", icon: MdLogout, click:true }
      ];

  async function handleSignOut(e:React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try{
      const response = await fetch('https://magicsplitapi-production.up.railway.app/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`,
        },
      });
      if(response.ok) {
        auth.signOut()
        navigate('/login')
       }
    }
    
    catch(error) {
      console.error("Error al realizar la solicitud:", error);
    }

  }
  if (location.pathname === '/signup' || location.pathname === '/login') {
    return null; // Don't render anything if we are on the home(registration) page or log in page
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  
  return (
    <>
      <div className="md:hidden fixed top-5 left-4 z-10">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-slate-300 text-white rounded-md focus:outline-none"
        >
          <FaBars size={20} />
        </button>
      </div>
      <div className={`fixed md:relative transform top-0 left-0 w-80 h-full transition-transform bg-slate-100 min-h-screen text-slate-900 px-4  ${isOpen ? 'translate-x-0 z-20' : '-translate-x-full z-0'} md:translate-x-0`}>
        {/* Sidebar items */}
        <div className={`flex flex-col gap-4 relative`}>
        <Link to={'/grupos'}>
          <h1 className="text-3xl  text-slate-900 text-left font-extrabold mt-8 mb-2 ">MagicSplit🪄</h1>
        </Link>
        {menus?.map((menu: Menu, i: number) => (
          i === 0 ? (
            <div
              key={i}
              className="group flex text-center items-center gap-3.5 font-medium p-2 rounded-md w-auto"
            >
              <div>{React.createElement(menu?.icon, { size: "30" })}</div>
              <h1 className='whitespace-pre text-xl'>
                {menu?.name}
              </h1>
            </div>
          ) : (
            <Link to={menu.link}
              key={i}
              className="group flex text-center items-center gap-3.5 font-medium p-2 hover:bg-slate-200 rounded-md w-auto"
              {...(menu?.click && {onClick:handleSignOut})}
            >
              <div>{React.createElement(menu?.icon, { size: "30" })}</div>
              <h1 className='whitespace-pre text-xl'>
                {menu?.name}
              </h1>
            </Link>
          )
        ))}
        </div>
      </div>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default SideBar;
