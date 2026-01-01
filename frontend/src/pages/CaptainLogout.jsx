import React, { use, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {

    
    const navigate = useNavigate();
   useEffect(() => {
    localStorage.removeItem('token');
    navigate('/captain-login');
   }, []);
  return (
    <div>
      captainLogout
    </div>
  )
}

export default  CaptainLogout;
