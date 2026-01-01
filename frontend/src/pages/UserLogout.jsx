import React, { use, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {

    
    const navigate = useNavigate();
   useEffect(() => {
    localStorage.removeItem('token');
    navigate('/login');
   }, []);
  return (
    <div>
      UserLogout
    </div>
  )
}

export default UserLogout
