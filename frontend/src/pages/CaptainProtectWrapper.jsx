import React,{useContext, useEffect} from 'react'
import {CaptainDataContext} from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const CaptainProtectWrapper = ({
    children
}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const [isLoading, setIsLoading ] = useState(true);
   



  

  useEffect(() => {


    if(!token){
        navigate('/captain-login');
    }
 
    

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setCaptain(response.data);
      setIsLoading(false);
    })
    .catch(error => {
        console.log(error);
        localStorage.removeItem('token');
            navigate('/captain-login')
 } )
    
}, [token]);

    if(isLoading){
        return ( <div>Loading...</div>
        )
    }




    
  return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectWrapper
