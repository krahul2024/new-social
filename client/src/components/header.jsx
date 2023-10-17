import React, {useState , useEffect , useContext} from 'react' 
import {NavLink , useNavigate} from 'react-router-dom' 
import {UserContext} from '../userContext'
import axios from 'axios'
import Image from './image'
import UpdateProfileModal from './updateProfileModal'
import profile from '../images/profile.webp'

const Header = ({user}) => {
  if(!user) return null; 

  const navigate = useNavigate() 
  const {profile , setProfile } = useContext(UserContext) 
  const [showModal, setShowModal] = useState(false); 

  const isSame = profile?.username === user?.username 
  const [profileImage ,setProfileImage] = useState({}); 
  const [coverImage , setCoverImage] = useState({}) ; 

  const handleImage = async (e , type ) => {
    e.preventDefault() ;
    const image = e.target?.files[0] ,
     preview = URL.createObjectURL(image) 
     console.log({type})
    if(type === 'profile' ) setProfileImage({image , preview}); 
    else if(type === 'cover') setCoverImage({image , preview});
  }
  
  // console.log({profile_:user?.profileImage, cover_:user?.coverImage})

  const cancelChange = async (e , type) => {
    e.preventDefault() ; 
    if(type === 'profile' ) setProfileImage({}); 
    else if(type === 'cover') setCoverImage({});
  }

  const uploadImage = async (e,type) => {
    e.preventDefault() ; 
    try{
      const data = new FormData() ; 
      if(type === 'profile') data.append('files' , profileImage.image);
      else if(type === 'cover') data.append('files' , coverImage.image); 

      const response = await axios.post('/upload/images', data , { withCredentials:true }); 
      if(response?.data) {
        const imagePath = response.data.images[0] 
        // console.log({response})
        let updatedUser = user 
        if(type === 'profile')updatedUser.profileImage = imagePath 
        else if(type === 'cover') updatedUser.coverImage = imagePath 
        const uploadResponse = await axios.post('/user/update' , {
          user:updatedUser 
        },{withCredentials:true}) ; 

        if(uploadResponse?.data){
          setProfile(uploadResponse.data.user) ; 
          if(type === 'profile' ) setProfileImage({}); 
          else if(type === 'cover') setCoverImage({})
        }
      }
    }
    catch(error){
      console.log({message:error.message})
      if(type === 'profile') setProfileImage({}) ; 
      else if(type === 'cover') setCoverImage({});
    }
  }

  // const profilePic = `http://localhost:4000/uploads/${user.profileImage.name.pad+user.profileImage.name.original}`; 
  // console.log({profilePic})
  const openModal = () => {
    setShowModal(true); 
  }
  const closeModal = () => {
    setShowModal(false); 
  }


  return (<> 

      <div className="p-2">
        <div className="relative flex">
            <div className="relative w-full h-64 border rounded-md border-gray-800">
                {coverImage?.image ? (
                    <img className="w-full object-cover h-64 rounded-md"
                      src={coverImage.preview} alt="cover-preview"/>
                  ):(
                    <Image photo={user?.coverImage}
                      className="w-full object-cover h-64 rounded-md"
                      alt="cover-image"
                      />
                  )}

              {/*--------------camera icon, confirmation and cancellation icon*/}
              {isSame && ( 
                <label onChange={ (e) => handleImage(e,'cover') }
                  htmlFor="coverFileInput" className="cursor-pointer absolute mx-0.5 bottom-0 right-0 text-gray-500 hover:text-white">
                  <input type="file" accept="image/*" id="coverFileInput" className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                </label> 
              )}

              {isSame && coverImage?.image && (
                <div className="absolute flex gap-1.5  mx-auto mb-1 text-sm -bottom-0 right-8 cursor-pointer">
                  <button onClick = {(e) => cancelChange(e,'cover') }
                    className="shadow-md bg-sky-900 text-white rounded-md px-2">Cancel</button>
                  <button onClick={(e) => uploadImage(e,'cover')}
                    className="shadow-md bg-sky-900 text-white rounded-md px-2">Confirm</button>
                </div>
              )}
            </div>
            

              <div className="absolute bottom-0 flex gap-2 justify-between w-full translate-y-[103%]">
                <div className="flex justify-between translate-x-[8%]"> 
                  <div className="flex -translate-y-[40%] translate-x-[3%]">
                    {profileImage?.image ? (
                      <img className="w-36 h-36 object-cover rounded-full border-8 border-gray-300"
                        src={profileImage.preview} alt="profile-preview"/>
                    ): user?.profileImage? (
                      <Image photo={user?.profileImage}
                        className="w-36 h-36 object-cover rounded-full border-[4px] border-gray-900"
                        alt="profile-image"
                        />
                    ):(
                      <img src={profile}
                        className="w-32 h-32 object-cover rounded-xl border border-gray-700"
                        alt="profile-image"
                        />
                    )}

                    {/*--------------camera icon, confirmation and cancellation icon*/}
                    {isSame && ( 
                      <label onChange = { (e) => handleImage(e,'profile') }
                         htmlFor="profileFileInput" className="relative top-[78%] right-[48%] rounded-2xl text-gray-500 hover:text-white cursor-pointer">
                        <input type="file" accept="image/*" id="profileFileInput" className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                          <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                      </label>
                    )}{isSame && profileImage?.image && (
                        <div className="absolute flex gap-1.5  mx-auto mb-1 text-sm -bottom-7">
                          <button onClick = {(e) => cancelChange(e,'profile') }
                            className="shadow-md bg-sky-900 text-white rounded-md px-2 py-0.5 cursor-pointer">Cancel</button>
                          <button onClick={(e) => uploadImage(e,'profile')}
                            className="shadow-md bg-sky-900 text-white rounded-md px-2 py-0.5 ">Confirm</button>
                        </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-gray-300">
                      {user.name}
                    </span>
                    <span className="text-gray-400 text-xs -mt-1">
                      @{user.username}
                    </span>
                    <span className="text-sm mt-1">
                      {/*{profile?.bio}*/}
                    </span>
                  </div>
                </div>
                {isSame?(
                  <div className="py-6">
                    <button onClick={openModal}
                      className="text-indigo-400 hover:text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                      </svg>
                    </button>
                </div>
              ):(
                <div>
                  
                </div>
              )}
              </div>

            </div>
          </div>

          {showModal && <UpdateProfileModal onClose={closeModal} />}
    </>)
}

export default Header ; 