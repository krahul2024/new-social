import React, { useState , useContext, useEffect} from 'react';
import {NavLink, useNavigate} from 'react-router-dom'; 
import axios from 'axios'; 
import Image from './image'
import {UserContext} from '../userContext'
import Post from './post'

const Comments = () => {
  const {profile, setProfile, setPosts, currPost, setCurrPost} = useContext(UserContext); 
  if(!currPost) return null; 

  const [comments, setComments] = useState(currPost.comments || []); 

  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); 

  const handleReadMore = () => {
    setIsExpanded(true);
  };

  const renderCaption = (caption) => {
  if (isExpanded) {
    const words = caption.split(' ');
    if (words.length > 40) {
      return (
        <>
          {caption}
          <button onClick={() => setIsExpanded(false)} className="read-more-button text-indigo-700 flex justify-start">
            Read Less
          </button>
        </>
      );
    } else {
      return caption;
    }
  } else {
    const words = caption.split(' ');
    if (words.length > 40) {
      const shortenedCaption = words.slice(0, 40).join(' ');
      return (
        <>
          {shortenedCaption}...
          <button onClick={handleReadMore} className="read-more-button text-indigo-500">
            Read More...
          </button>
        </>
      );
    } else {
      return caption;
    }
  }
  };
  
  useEffect(() => {
    setComments(currPost.comments || []); 
  }, [currPost])  

  function getDate(dateString) {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
  }

  const commentImages = (comment, index) => {
    const {photos } = comment; 
    if(photos.length < 1) return null; 
    return (
       <div key={index} className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1 flex justify-center items-center">
        {photos.map((photo, idx) => (
            <Image key={idx}
              className="object-cover h-36 rounded w-40"
              photo={photo}
              />
        ))}
      </div>
    )
  }

  return (<>
    <div className="w-full px-1 border-t border-gray-800">
      {comments.slice().reverse().map((comment, index) => (
        <div key={index} className="w-full m-1 border border-gray-800 rounded-md p-1">
          <div className="flex gap-3 justify-start items-center">
            <NavLink className="flex gap-2 text-sm items-center" to={`/profile/${comment.by?._id}`}>
              <Image 
                className={`h-12 w-12 rounded-full p-1`}
                photo={comment.by?.profileImage}
                />
              <div className="flex flex-col">
                <span>{comment.by?.name}</span>
                <span className="text-xs opacity-60">{getDate(comment.createdAt)}</span>
              </div>
            </NavLink>
          </div>
          <div className="flex flex-col p-1 text-sm opacity-90 gap-2">
            {renderCaption(comment.caption)}
            {commentImages(comment, index)}
          </div>
          <div className="flex text-gray-400 gap-2">
            <button className="flex gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span>{comment.likes.length > 0 ? comment.likes.length : ''}</span>
            </button>
            <button className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
              <span>{comment.comments.length > 0 ? comment.comments.length : '' } </span>
            </button>
            <button className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
            <button className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  </>);
};

export default Comments;
