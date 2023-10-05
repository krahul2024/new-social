import React , {useState, useContext, useEffect} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'; 
import Image from './image'
import Reactions from './reactions'


const Post = ({post, rest}) => {
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

	// console.log({getCaption()})

	
if(post)
	return (<> 
		<div className="p-1 border border-gray-800 rounded-xl m-1">
		
		{/*----------Display the profile details */}
			<div className="flex justify-between items-center p-1">
				<button onClick={(e) => {
					navigate(`profile/${profile._id}`)
				}}
					className="flex items-center gap-2">
					<Image 
						className="border border-gray-600 h-14 w-14 rounded-full"
						photo={photos[0]}
						/>
					<span className="flex flex-col items-start px-2">
						<span className="text-xl">{profile.name}</span>
						<span className="text-gray-300 text-xs">{`${time[2]} ${time[1]}, ${time[4]}`}</span>
					</span>
				</button>
			</div>

		{/*---------Display the caption------*/}
			<div className="px-4 py-2">
				{renderCaption()}
			</div>

		{/*----------Display all the images using next scroll approach---------*/}
			<div className="flex p-2 justify-between items-center">
				<button onClick={(e) => {
					e.preventDefault(); 
					setImgIdx((imgIdx-1+photos.length)%(photos.length))
				}}
					className="rounded-full p-1 text-gray-400 hover:text-white shadow-xl border border-gray-600 hover:border-gray-500">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-6 h-6">
					  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</button>	
				<Image 
					className="w-[90%] h-[720px] object-cover mx-1 rounded-2xl border border-gray-700"
					photo={photos[imgIdx]} 
				/>
				<button onClick={(e) => {
					e.preventDefault()
					setImgIdx((imgIdx+1)%(photos.length))
				}}
					className="rounded-full p-1 text-gray-400 hover:text-white shadow-xl border border-gray-600 hover:border-gray-500">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-6 h-6">
					  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			</div>

		{/*--------------------Reactions------------------------*/}
			<Reactions post={post}/>
		</div>

	</>)
}

export default Post; 