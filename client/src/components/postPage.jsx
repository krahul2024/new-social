import React, { useState , useContext, useEffect } from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom'; 
import NewPost from './newPost'
import Post from './post'; 
import {UserContext} from '../userContext'; 
import axios from 'axios'; 
import Image from './image'
import Header from './header'
import Comments from './comments'

const PostPage = () => {
  const navigate = useNavigate(); 
  const {profile, setProfile, currPost, setCurrPost, setIsFeed} = useContext(UserContext); 
  const [post,setPost] = useState(null); 
  const location = useLocation(); 
  const path = location.pathname; 
  const postId = path.split('/')[2]; 

  const getPost = async() => {
    try{
      const response = await axios.post(`post/get`, {postId:postId.toString()}, { withCredentials : true }); 
      if(response?.data){
        console.log({data:response.data})
        setPost(response.data.post); 
        setCurrPost(response.data.post); 
      }
    }catch(error){
      console.log({error}); 
    }
  }
  useEffect(() =>{
    getPost(); 
  }, [])

  const backToFeed = () => {
    setIsFeed(true); 
    navigate('/')
  }

  if(!currPost) return null; 


  return (<>
    <div className="flex flex-col items-center justify-center">
      <div className="p-2 flex flex-col min-w-[500px] w-[70%] max-w-[800px] border border-gray-800">
        <button onClick={() => navigate('/')}
          className="flex justify-start gap-8 items-center text-gray-400 font-semibold p-2 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
          </svg>
          Back to feed
        </button>
        <Post post={currPost} user={currPost.by}/>
        <NewPost type={'comment'}/>
        <Comments/>
      </div>
  </div>
  </>);
};

export default PostPage; 
