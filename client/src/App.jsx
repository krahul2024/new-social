import { useState } from 'react'
import {NavLink, Routes, Route} from 'react-router-dom' 
import axios from 'axios' 
import Navbar from './components/navbar'
import Feed from './components/feed'
import {UserContextProvider} from './userContext' 

axios.defaults.baseURL = 'http://localhost:4000' 

function App() {
  const [count, setCount] = useState(0)

  return (<>
    <UserContextProvider>
    <Navbar /> 

    <Routes>
        <Route path="/" element={<Feed />} /> 
    </Routes>
    </UserContextProvider>
    </>
  )
}

export default App
