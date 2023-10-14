import React, { createContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
export const UserContext = createContext({})

export function UserContextProvider({ children }) {

    const [profile, setProfile] = useState(null); 
    const [isHome, setIsHome] = useState(false);
    const [currPost, setCurrPost] = useState(null); 
    const [posts, setPosts] = useState([]); 




    const getUser = async () => {
        try {
            const response = await axios.get('/user/profile', { withCredentials: true })
            // console.log('user', response.data.user)
            setProfile(response.data.user)
        } catch (error) {
            // alert(error.response.data.msg)
        }
    }
    const getPosts = async () => {
        try {

            const response = await axios.get('/post/all', { withCredentials: true })
            if (response ?.data ?.success) {
                setPosts(response ?.data ?.posts)
            }
            // console.log({ response })
        } catch (error) {
            // alert(error.response.data.msg)
        }
    }
    useEffect(() => {
        getUser();
        getPosts(); 
    }, [])

    // console.log({posts})
    

    return ( < >

        <UserContext.Provider 
             value = {{
             		profile , setProfile, 
                    posts, setPosts, 
                    currPost, setCurrPost, 
                    isHome, setIsHome
                }} 
                >{children}
              </UserContext.Provider> <
        />)
    }