import React, {useState, useContext, useEffect} from 'react'; 
import {NavLink, useLocation} from 'react-router-dom';
import {UserContext} from '../userContext'; 
import axios from 'axios'

const Reactions = ({post}) => {
	const location = useLocation(); 
	const path = location.pathname; 

	const {currPost, setCurrPost, profile, isHome, setIsHome, posts, setPosts, setProfile} = useContext(UserContext);
	if(!post) return null; 

	const [isLiked, setIsLiked] = useState(post.likes?.includes(profile?._id.toString())); 
	const [likes, setLikes] = useState(post.likes?.length || 0)
	const [comments, setComments] = useState(post.comments || []); 
	const [saved, setSaved] = useState(profile?.savedPosts?.includes(post?._id?.toString())); 
	const [updatedPost, setUpdatedPost] = useState(post); 

	const getPost = async() => {
		try{
			const postResponse = await axios.get(`/post/${post._id}`, {withCredentials:true}); 
			if(postResponse?.data){
				setCurrPost(postResponse.data.post); 
			}
		}catch(error){
			console.log({error})
		}
	}

	const likePost = async(e) => {
		e.preventDefault(); 
		if(!profile) return ; 
		// console.log(post._id, profile._id)k
		console.log('liked')
		try{
			const response = await axios.post('/post/like', {
				postId:post._id, userId: profile._id
			}, {withCredentials : true })
			if(response?.data){
				const postResponse = response.data.post; 
				console.log({postResponse}); 
				setCurrPost(postResponse); 
				setUpdatedPost(postResponse); 
				setLikes(postResponse.likes.length)
				setIsLiked(postResponse.likes.includes(profile._id));
			}
		}catch(error){
			console.log({error}); 
		}
	}	
	const savePost = async(e) => {
		e.preventDefault();
		if(!profile) return ; 
		try{
			const response = await axios.post('/post/save', {
				postId:post._id, userId:profile._id
			}, { withCredentials : true }); 

			if(response?.data){
				const user = response.data.user; 
				console.log({user}); 
				setProfile(user); 
				setSaved(user?.savedPosts?.includes(post._id.toString())); 
			}

		}catch(error){
			console.log(error); 
		}

	}

	useEffect(() => {
		if(path.includes('post')){
			setComments(currPost?.comments);
			setLikes(currPost?.likes?.length); 
			setIsLiked(currPost?.likes?.includes(profile?._id.toString()));
			setSaved(profile?.savedPosts.includes(post?._id.toString())); 
		}
		else {
			setComments(updatedPost.comments); 
			setLikes(updatedPost.likes?.length); 
			setIsLiked(updatedPost.likes?.includes(profile?._id.toString()));
			setSaved(profile?.savedPosts.includes(updatedPost?._id.toString())); 
		}
	}, [currPost, profile])

	const sharePost = (e) => {
		e.preventDefault(); 
		alert('Shared'); 
	}

if(post)
	return (<> 
		<div className="flex px-1 py-2 mt-4 items-center justify-between">
			<div className="flex gap-6">
				<button onClick={(e) => likePost(e)}
					className={`flex gap-1 items-center justify-center ${isLiked?'text-rose-600':'text-gray-400'}`}>
					{!isLiked ? 
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
						</svg> : 
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
						  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
						</svg>
					}
					<span className="text-md">{likes > 0 ? likes : ''}</span>
				</button>

				<NavLink to={`/post/${post._id}`}
					className="flex gap-1 items-center justify-center text-gray-400">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
					  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
					</svg>
					<span className="text-md">{comments?.length > 0 ? comments?.length : ''}</span>
				</NavLink>

				<button className={`${saved?'text-red-600':'text-gray-400'}`} onClick={(e) => savePost(e)}>
					{!saved ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
							  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
							</svg> 
							: 
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
							  <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93zM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 013.75 21z" />
							</svg>
					}
				</button>
			</div>

			<button className="text-gray-400" onClick={(e) => sharePost(e)}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
				  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
				</svg>
			</button>
		</div>

	</>)
}


export default Reactions; 