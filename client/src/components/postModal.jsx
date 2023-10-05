import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../userContext';
import Post from './post';
import NewPost from './newPost';

const PostModal = ({ onClose }) => {
  const { currPost } = useContext(UserContext);
  if (!currPost) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 opacity-100 backdrop-blur-md">
      <div className="bg-gray-900 border-[1px] border-gray-900 w-1/3 rounded-lg relative min-w-[540px] w-[66%] max-w-[800px]">
        <button
          className="flex gap-4 items-center absolute top-2 left-2 text-gray-300 text-lg hover:text-white hover:font-semibold"
          onClick={onClose}
        >
          {/* ------------ Back button icon -------------- */}
          Back to Feed
        </button>

        {/* ----------Scrollable Post modal------------- */}
        <div className="mt-12 max-h-[1000px] overflow-y-auto">
          <Post post={currPost} />
          <NewPost />
        </div>
      </div>
    </div>
  );
};

PostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PostModal;
