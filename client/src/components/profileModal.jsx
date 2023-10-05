import React, { useState , useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom'; 
import axios from 'axios'
import {UserContext} from '../userContext'

/* 
This modal contains following items 
1. View profile
2. Update profile
3. Connections
4. Groups
5. Likes
6. Posts
7. Media 

*/

const Auth = ({ onClose }) => {
  const navigate = useNavigate(); 
  const {profile, setProfile} = useContext(UserContext); 
  if(!profile) return null; 
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-100 opacity-100 backdrop-blur-sm">
      <div className="bg-gray-900 border-[1px] border-gray-700 p-8 w-1/3 rounded-lg relative ">
        <button
          className="mb-2 absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={onClose}
          > Close
        </button>
        <div>
          <span>View Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
