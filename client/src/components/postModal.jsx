import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../userContext';
import Post from './post';
import NewPost from './newPost';
import Comments from './comments'
import axios from 'axios'

const PostModal = ({ onClose }) => {
  const { currPost , posts, setPosts} = useContext(UserContext);
  if (!currPost) return null;

  const updatePosts = () => {
  const updatedPosts = posts.map((post) => {
      if (post._id === currPost._id) {
        return currPost; // Replace the matching post with currPost
      }
      return post; // Keep other posts as they are
    });

    setPosts(updatedPosts);
  };

useEffect(() => {
  updatePosts();
}, [currPost]); // Add currPost and posts to the dependency array


  return (
    <div className="fixed fixed inset-0 flex items-center justify-center z-50 opacity-100 backdrop-blur-md">
      <div className="bg-gray-900 border-[1px] border-gray-900 w-1/3 rounded-lg relative min-w-[540px] w-[66%] max-w-[800px]">
        <button
          className="flex gap-4 items-center absolute top-2 left-2 text-gray-300 text-lg hover:text-white hover:font-semibold"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
          Back to Feed
        </button>

        {/* ----------Scrollable Post modal------------- */}
        <div className="relative mt-12 max-h-[1000px] overflow-y-auto">
          <Post post={currPost} />
          <div className="px-3 py-1 text-lg">
            Comment your Reply...
          </div>
          <NewPost type={'comment'}/>
          <Comments /> 
        </div>
      </div>
    </div>
  );
};

PostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PostModal;
