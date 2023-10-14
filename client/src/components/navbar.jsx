import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Auth from './auth';
import { UserContext } from '../userContext';
import '../index.css'
import ProfileModal from './profileModal';

const Navbar = () => {
  const navigate = useNavigate(); 
  const { profile, setProfile } = useContext(UserContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const openModal = () => {
    if (!profile) {
      setShowAuthModal(true);
    } else {
      toggleProfileMenu(); // Call the toggleProfileMenu function when profile is already set
    }
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setShowProfileMenu(false);
  };

  // Function to toggle the profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const getProfileItem = (value, url) => {
    return (
      <>
        <li className="text-gray-200 px-3 text-md p-2 hover:font-semibold hover:text-white hover:text-indigo-500">
          <button onClick={() => {
            setShowProfileMenu(false);
            navigate(url); 
          }}>{value}</button>
        </li>
      </>
    );
  };

  return (
    <>
      <nav
        className={`bg-gray-800 text-white p-4 flex justify-between ${
          showProfileMenu ? 'blur-background' : '' // Apply the blur class conditionally
        }`}
      >
        <NavLink to="/" className="text-lg font-semibold">
          Social
        </NavLink>
        <div className="flex space-x-8 items-center">
          <NavLink to="">Connections</NavLink>
          <NavLink to="">Notifications</NavLink>
          <NavLink to="">Messages</NavLink>
          <button
            onClick={openModal}
            className="flex gap-2 border border-gray-500 px-2 py-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>          
          </button>
        </div>
      </nav>

      {showAuthModal && !profile && <Auth onClose={closeModal} />}
      {showProfileMenu && (
        <div className="full-screen-overlay">
          <div className="absolute override right-0 border border-slate-700 bg-gray-800 rounded-b-md shadow-sm w-40 transition-all duration-1000">
            {profile && (
              <ul className="py-1">
                {getProfileItem('View Profile', `/profile/${profile?._id}`)}
                {getProfileItem('Connections', '/home/connections')}
                {getProfileItem('Groups', '/groups')}
                <button
                  onClick={(e) => {
                    handleLogout(e);
                  }}
                  className="text-gray-200 px-3 text-md p-2 hover:font-semibold hover:text-white hover:text-indigo-500"
                >
                  Logout
                </button>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
