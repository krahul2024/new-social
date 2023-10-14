import React, { useContext, useEffect , useState} from 'react';
import { UserContext } from '../userContext';
import axios from 'axios'

const UpdateProfileModal = ({ onClose }) => {
  const { profile, setProfile} = useContext(UserContext);
  if (!profile) return null; 
  
  const [user, setUser] = useState({
      username: profile.username,
      name: profile.name,
      location: profile.location,
      status: profile.status,
      email: profile.email,
      phone: profile.phone, 
      bio:profile.bio,
  })

  const handleInputs = (e) => {
      const name = e.target.name,
          value = e.target.value
      setUser({ ...user, [name]: value })
  }


  const updateProfile = async (e) => {
      e.preventDefault()
      // console.log({user})

      try {
          const updatedUser = { ...profile, ...user }
          console.log({ updatedUser })
          
          const updateResponse = await axios.post('/user/update', {
              user: updatedUser
          }, {
              withCredentials: true
          })

          if (updateResponse?.data) {
              console.log({data : updateResponse.data})
              setProfile(updateResponse.data.user)
          }

      } catch (error) {
          console.log({ error})
      }

      onClose(); // closing the modal 
  }

 const getItem = (label, name, type, value, isDisabled = false) => {
  return (
    <div className="p-1">
      <label htmlFor={name} className="block font-semibold py-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          name={name}
          onChange={(e) => handleInputs(e)}
          className="w-full border border-gray-600 bg-gray-800 px-4 py-3 hover:bg-slate-900 rounded-lg outline-none hover:border-gray-500"
          disabled={isDisabled}
        />
      ) : (
        <input
          type={type}
          value={value}
          name={name}
          onChange={(e) => handleInputs(e)}
          className="w-full border border-gray-600 bg-gray-800 px-4 py-3 hover:bg-slate-900 rounded-lg outline-none hover:border-gray-500"
          disabled={isDisabled}
        />
      )}
    </div>
  );
};
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 opacity-100 backdrop-blur-md">
      <div className="bg-slate-900 border-[1px] border-gray-700 w-1/3 p-2 mb-12 rounded-lg relative min-w-[480px] w-[66%] max-w-[850px]">
        <div className="flex flex-col justify-center px-4 py-2">
          <span className="text-xl font-semibold text-center text-white px-2 py-6">Update your profile...</span>
          {getItem('Username', 'username', 'text', user.username, true)}
          {getItem('Name', 'name', 'text', user.name)}
          {getItem('Email', 'email', 'email', user.email)}
          {getItem('Phone', 'phone', 'text', user.phone)}
          {getItem('Bio', 'bio', 'text', user.bio)}
          {getItem('Location', 'location', 'textarea', user.location)}
        </div>
        <div className="flex items-center justify-center gap-2 w-full py-4 px-6 mb-12">
          <button onClick={updateProfile}
            className="border w-full rounded-md py-2 border-gray-600 hover:border-gray-500 hover:bg-slate-950 hover:font-semibold">
            Continue 
          </button>
          <button onClick={onClose}
            className="border w-full rounded-md py-2 border-gray-600 hover:border-gray-500 hover:bg-slate-950 hover:font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal; 
