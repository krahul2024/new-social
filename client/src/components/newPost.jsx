import React, { useState , useContext, useEffect} from 'react';
import {NavLink} from 'react-router-dom'; 
import axios from 'axios'; 
import {UserContext} from '../userContext'
import Image from './image'
import Auth from './auth'

const NewPost = ({type}) => {
  const {profile, setProfile, posts, setPosts, currPost, setCurrPost} = useContext(UserContext); 
  const [caption, setCaption] = useState(''); 
  const[videos, setVideos] = useState([]); 
  const[links, setLink] = useState([]); 
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openModal = () => {
    setShowAuthModal(true);
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  // image previews 
  const[previews, setPreviews] = useState([]); 

  // console.log({profile})
  // console.log({caption})

  const handleImageInputs = (e) => {
  	e.preventDefault(); 
  	const files = Array.from(e.target.files); 
  	files.forEach((file) => {
  		const reader = new FileReader(); 

  		reader.onload = (e) => {
  			const image = e.target.result; 
  			setPreviews((prev) => [...prev, {base : image, original:file}])
  		}
  		reader.readAsDataURL(file); 
  	})
  }

  const removeImage = (index) => {
  	setPreviews((prevPreviews) => 
  		prevPreviews.filter((_, i) => i !== index) 
  	)
  }

  const createNewPost = async(e) => {
  	e.preventDefault(); 
  	try{

  		// create the image data
  		const data = new FormData(); 
  		for(const preview of previews) data.append('files', preview.original); 

  		// upload the images 
  		const imageResponse = await axios.post('/upload/images', data , {withCredentials:true})
  		// console.log({data : imageResponse?.data})

  		if(type == 'post'){
	  		// console.log('creating a new post....')
		  	const postResponse = await axios.post('/post/newPost' , {
		  			caption ,
		  			photos : imageResponse?.data?.images , 
		  			by : profile?._id
		  		}, {withCredentials : true})
		  		
		  		// console.log({data : postResponse?.data})
		  		if(postResponse?.data){
		  			const {post, user} = postResponse.data 
		  			setPosts((prev) => [...prev, post])
		  			setProfile(user)
		  		}
	  	}
	  	else if(type == 'comment'){
	  		// console.log('creating a new comment'); 
	  		const commentResponse = await axios.post('/post/newComment', {
	  			caption, photos:imageResponse?.data?.images, 
	  			by:profile?._id, 
	  			postId:currPost?._id
	  		}, { withCredentials : true }); 
	  		if(commentResponse?.data){
	  			const post = commentResponse?.data.post; 
	  			setCurrPost(post); 
	  			console.log({post}); 
	  		}
	  	}
  			setPreviews([])
  			setCaption('')
  	}
  	catch(error){
  		console.log({error})
  	}
  }



 if(profile) return (
    <div className="rounded-xl w-full">
      <div className="py-1 px-1">
				<div className="relative">
				  <NavLink to={`/profile/${profile?._id}`} className="absolute left-2 top-2 border border-gray-600 rounded-full">
				    	<Image 
				    		photo={profile?.profileImage?.name}
				    		className="h-10 w-10 object-cover rounded-full"
				    		/>
				  </NavLink>
				  <textarea
				    placeholder={`${type=='comment'?'Comment your thoughts...':"What's going on..."}`}
				    className="h-32 min-w-[400px] w-[100%] max-w-[800px] rounded-xl bg-gray-800 outline-none px-16 py-4 text-sm text-gray-200"
				    name="caption"
				    value={caption}
				    onChange = {(e) => setCaption(e.target.value)}
				    id=""
				    cols="30"
				    rows="10"
				  ></textarea>
				</div> 

      		
      		{/*image,  gif, video , link are*/}
      		<div className="grid grid-cols-4 gap-1 p-1">
      		{previews?.length>0 && previews.map((image, index) => (
      			<div key={index} className="relative">
      				<img className="h-44 w-44 rounded-lg"
      					src={image.base} alt=""/>
      				<button onClick={(e) => removeImage(index)}
      					className="absolute top-0 right-0 bg-rose-600 rounded-tr-lg rounded-bl-md "
      					>
      					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
      				</button>
      			</div>
      		))}
      		</div>
      		<div className="flex gap-4 justify-between w-full px-4 text-gray-400">
      			<div className="flex gap-6">
	      			<label htmlFor="image" className="cursor-pointer hover:text-blue-500">
	      				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					  		<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
						</svg>
					</label>
					<input onChange={handleImageInputs} className="hidden"
						type="file" multiple accepth=".png,.jpeg,.webp,.jpg" id="image"/>
					

					<label htmlFor="Gif" className="cursor-pointer hover:text-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
						</svg>
					</label>
					<input onChange={handleImageInputs} className="hidden"
						type="file" multiple accepth=".png,.jpeg,.webp,.jpg,.gif" id="Gif"/>

					<label htmlFor="vidoes" className="cursor-pointer hover:text-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
						</svg>
					</label>
					<input onChange={handleImageInputs} className="hidden"
						type="file" multiple accept="video/*" id="videos"/> 

					<button className="hover:text-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
						</svg>
					</button>
				</div>
				<button onClick={createNewPost}
					className="hover:text-blue-600 brightness-125">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
					  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
					</svg>
				</button>	
      		</div>
      	</div>
    </div>
  );
	else return (<>
		<div className="p-3">
			<button onClick={openModal}
				className={`w-full px-8 py-2 border-b-[1px] border-gray-800 hover:border-indigo-900 rounded-2xl text-gray-400 bg-gray-900 hover:shadow-sky-800 hover:text-indigo-600`}
			>
				Join the conversation, share what's going on...
			</button>
		</div>
		{showAuthModal && !profile && <Auth onClose={closeModal} />}
	</>)
};

export default NewPost;
