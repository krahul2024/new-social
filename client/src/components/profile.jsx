import React, { useState , useContext, useEffect } from 'react';
import {NavLink, useLocation} from 'react-router-dom'; 
import NewPost from './newPost'
import Post from './post'; 
import {UserContext} from '../userContext'; 
import axios from 'axios'; 
import Image from './image'
import Header from './header'

const Profile = () => {
  const {posts, profile, currPost} = useContext(UserContext); 
  const [user, setUser] = useState(null); 
  const location = useLocation(); 
  const path = location.pathname; 
  const userId = path.split('/')[2]; 

  const getUserById = async() => {
    try{
      const response = await axios.get(`/user/${userId}`, {withCredentials : true}); 
      console.log({data : response?.data})
      if(response?.data){
        setUser(response.data.user); 
      }

    }catch(error){
      console.log({error})
    }
  }
  useEffect(() => {
    getUserById();
  },[profile])


  if(!user) return (
      <div className="flex justify-center items-center p-4 text-xl text-rose-600">
        <span>
          Well, nothing's here
        </span>
    </div>
)


  return (<>
    <div className="flex flex-col items-center justify-center">
      <div className="px-2 py-1 min-w-[480px] w-[80%] max-w-[860px]">
        <Header user={user}/>
    </div>
  </div>
 
  </>);
};

export default Profile;
