import React , {useState, useContext, useEffect} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'; 
import Image from './image'
import Reactions from './reactions'
import {UserContext} from '../userContext'


const Post = ({ post }) => {
	if(!post) return null; 
	const [imgIdx, setImgIdx] = useState(0); 
	const [isExpanded, setIsExpanded] = useState(false);

	const navigate = useNavigate(); 
	const photos = post?.photos, profile = post?.by; 
	const time = new Date(post?.createdAt)?.toString()?.split(' '); 
	const captions = post?.caption?.split(' '); 

  	const handleReadMore = () => {
	    setIsExpanded(true);
	  };

	  const renderCaption = () => {
	  if (isExpanded) {
	    const words = post?.caption.split(' ');
	    if (words.length > 80) {
	      return (
	        <>
	          {post?.caption}
	          <button onClick={() => setIsExpanded(false)} className="read-more-button text-indigo-700 flex justify-start">
	            Read Less
	          </button>
	        </>
	      );
	    } else {
	      return post?.caption;
	    }
	  } else {
	    const words = post?.caption.split(' ');
	    if (words.length > 80) {
	      const shortenedCaption = words.slice(0, 80).join(' ');
	      return (
	        <>
	          {shortenedCaption}...
	          <button onClick={handleReadMore} className="read-more-button text-indigo-500">
	            Read More...
	          </button>
	        </>
	      );
	    } else {
	      return post?.caption;
	    }
	  }
	};

	
if(post)
	return (<> 
		<div className="p-1 border-gray-800 rounded-xl m-1 w-full border">
		
		{/*----------Display the profile details */}
			<div className="flex justify-between items-center p-1">
				<button onClick={(e) => {
					navigate(`profile/${profile._id}`)
				}}
					className="flex items-center gap-2">
					<Image 
						className="border border-gray-600 h-14 w-14 rounded-full"
						photo={post.by?.profileImage?.name}
						/>
					<span className="flex flex-col items-start px-2 opacity-80">
						<span className="text-lg">{post.by?.name}</span>
						<span className="text-gray-300 text-xs">{`${time[2]} ${time[1]}, ${time[4]}`}</span>
					</span>
				</button>
				<NavLink className="flex-grow py-6" to={`/post/${post._id}`}></NavLink>
			</div>

		{/*---------Display the caption------*/}
			<div className="flex flex-col py-1 text-sm opacity-90">
				<div>{renderCaption()}</div>
			</div>

		{/*----------Display all the images using next scroll approach---------*/}
			{post.photos.length>0 && <div className="flex p-2 justify-between items-center">
				{post.photos.length> 1 && <button onClick={(e) => {
					e.preventDefault(); 
					setImgIdx((imgIdx-1+photos.length)%(photos.length))
				}}
					className="rounded-full text-gray-500 hover:text-white shadow-xl border border-gray-600 hover:border-gray-500">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
					  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
					</svg>
				</button>}
				<Image 
					className={`w-[90%] h-[540px] object-cover px-2 rounded-3xl`}
					photo={photos[imgIdx]} 
				/>
				{post.photos.length>1 && <button onClick={(e) => {
					e.preventDefault()
					setImgIdx((imgIdx+1)%(photos.length))
				}}
					className="rounded-full text-gray-500 hover:text-white shadow-xl border border-gray-600 hover:border-gray-500">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
					  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
					</svg>
				</button>}
			</div>
		}

		{/*--------------------Reactions------------------------*/}
			
			<Reactions post={post}/>
		</div>

	</>)
}

export default Post; 