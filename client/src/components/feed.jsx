import React, { useState , useContext, useEffect } from 'react';
import {NavLink} from 'react-router-dom'; 
import NewPost from './newPost'
import Post from './post'
import {UserContext} from '../userContext'
import axios from 'axios'

const Feed = () => {
  const {posts, profile, isHome, setIsHome, setCurrPost, currPost, setPosts} = useContext(UserContext); 

  const getPosts = async () => {
        try {

            const response = await axios.get('/post/all', { withCredentials: true })
            if (response ?.data ?.success) {
                setPosts(response ?.data ?.posts)
            }
            // console.log({ response })
        } catch (error) {
            // alert(error.response.data.msg)
        }
    }


  useEffect(() => {
    setIsHome(true); 
    getPosts(); 
    const allPosts = posts; 
    allPosts.map((item, index) => {
        if(item._id == currPost?._id){
          item.likes = currPost.likes
          item.comments = currPost.comments
        }
    })
    setPosts(allPosts); 
    setCurrPost(null);
  }, [currPost]); 

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center min-w-[500px] w-[70%] max-w-[800px]">
      	<NewPost type={'post'}/>
        <div className="px-2 py-2 ">
          {posts && posts.length>0 && posts.map((post, index) => (
            <Post key={index} post={post}/> 
          ))}
        </div>
      	
      </div>
    </div>
  );
};

export default Feed;
