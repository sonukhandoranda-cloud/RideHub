import React from 'react'
import { createContext } from 'react';
import { useState } from 'react';
  

export const UserDataContext = createContext();



const UserContext = ({children}) => {

    const [user, setUser] = useState({
        email: '',
        fullName: {
            firstname: '',
            lastname: ''
        }
        
        
    }); // You can replace this with actual user data and methods
  return (
    <div>
      <UserDataContext.Provider  value={{ user, setUser}}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
