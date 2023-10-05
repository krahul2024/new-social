import React, { useState , useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom'; 
import axios from 'axios'
import {UserContext} from '../userContext'

const Auth = ({ onClose }) => {
  const navigate = useNavigate(); 
  const {profile, setProfile} = useContext(UserContext); 
  const [loginMode, setLoginMode] = useState(true);
  const [message, setMessage] = useState({
    text:'', success:false
  }); 
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const toggleMode = () => {
    setLoginMode(!loginMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (message.success) {
      setTimeout(() => {
        onClose();
      }, 600);
    }
  }, [message.success]);

  const handleLogin = async(e) => {
    e.preventDefault(); 
    try{
      const response = await axios.post('/auth/login', {user}, {withCredentials:true}); 
      if(response?.data){
        setMessage({text:response.data.msg, success:true})
        setProfile(response.data.user); 
      }
      navigate('/'); 
    }
    catch(error){
      if(error?.response?.data){
        setMessage({text:error.response.data.msg, success:false}); 
      }
    }
  }

  const handleRegister = async(e) => {
    e.preventDefault(); 
    try{
      const response = await axios.post('/auth/register', {user}, {withCredentials:true}); 
      if(response?.data){
        setMessage({text:response.data.msg, success:true})
      }
      navigate('/'); 
    }
    catch(error){
      if(error?.response?.data){
        setMessage({text:error.response.data.msg, success:false}); 
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 opacity-100 backdrop-blur-sm">
      <div className="bg-gray-900 border-[1px] border-gray-700 p-8 w-1/3 rounded-lg relative min-w-[500px] w-[66%] max-w-[800px]">
        <button
          className="mb-2 absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          Close
        </button>
        {loginMode ? (
          <div className="p-4">
            <h2 className="flex justify-center text-2xl font-semibold mb-4">
              Welcome Back!
            </h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4 p-1">
                <div className={`${message.success ? 'text-green-600' : 'text-rose-500'} font-semibold`}>{message.text}</div>
                <label htmlFor="username" className="block text-gray-200 p-1">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="border outline-none border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 px-4 py-3 w-full rounded-xl"
                />
              </div>
              <div className="mb-4 p-1">
                <label htmlFor="password" className="block text-gray-200 p-1">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="border outline-none border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 px-4 py-3 w-full rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-800 text-white px-4 py-2 rounded-full hover:bg-indigo-600"
              >
                Submit
              </button>
            </form>
            <p className="mt-4 flex items-center gap-2 justify-center">
              Not registered?{' '}
              <button
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              Join the conversation!
            </h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4 p-1">
                  <div className={`${message.success ? 'text-green-600' : 'text-rose-500'} font-semibold`}>{message.text}</div>
                <label htmlFor="name" className="block text-gray-200 p-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="border outline-none border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 px-4 py-3 w-full rounded-xl"
                />
              </div>
              <div className="mb-4 p-1">
                <label htmlFor="username" className="block text-gray-200 p-1">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.usernname}
                  onChange={handleChange}
                  className="border outline-none border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 px-4 py-3 w-full rounded-xl"
                />
              </div>
              <div className="mb-4 p-1">
                <label htmlFor="email" className="block text-gray-200 p-1">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="border outline-none border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 px-4 py-3 w-full rounded-xl"
                />
              </div>
              <div className="mb-4 p-1">
                <label htmlFor="password" className="block text-gray-200 p-1">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="border outline-none border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 px-4 py-3 w-full rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-800 text-white px-4 py-2 rounded-full hover:bg-indigo-600"
              >
                Submit
              </button>
            </form>
            <p className="mt-4 gap-2 flex justify-center items-center">
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
