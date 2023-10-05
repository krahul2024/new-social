import React, { useState , useContext, useEffect } from 'react';
import {NavLink} from 'react-router-dom'; 
import NewPost from './newPost'
import Post from './post'
import {UserContext} from '../userContext'

const Feed = () => {
  const {posts, profile, } = useContext(UserContext); 

  console.log({posts})

  return (
    <div className="flex flex-col items-center justify-center">
    	<NewPost />

      <div className="px-2 py-2 min-w-[400px] w-[80%] max-w-[800px]">
        {posts && posts.length>0 && posts.map((post, index) => (
          <Post key={index} post={post} /> 
        ))}
      </div>
    	
    </div>
  );
};

export default Feed;
