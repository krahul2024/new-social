import { useState } from 'react'
import {NavLink, Routes, Route} from 'react-router-dom' 
import axios from 'axios' 
import Navbar from './components/navbar'
import Feed from './components/feed'
import {UserContextProvider} from './userContext' 
import Profile from './components/profile'
import PostPage from './components/postPage'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true ; 

function App() {
  const [count, setCount] = useState(0)

  return (<>
    <UserContextProvider>
    <Navbar /> 

    <Routes>
        <Route path="/" element={<Feed />} /> 
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/post/:postId" element={<PostPage />} />
    </Routes>
    </UserContextProvider>
    </>
  )
}

export default App
