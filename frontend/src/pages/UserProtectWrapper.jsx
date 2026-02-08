import React,{useContext, useEffect} from 'react'
import {UserDataContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';



const UserProtectWrapper = ({
    children
}) => {
  const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserDataContext);
  
    const [isLoading, setIsLoading ] = useState(true);
     

  

  useEffect(() => {
    if(!token){
        navigate('/login');
    }

     axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setUser(response.data);
      setIsLoading(false);
    })
    .catch(error => {
        console.log(error);
        localStorage.removeItem('token')
            navigate('/login')
 } )
 
    }, [token]);
    
  return (
    <>
      {children}
    </>
  )
}

export default UserProtectWrapper
