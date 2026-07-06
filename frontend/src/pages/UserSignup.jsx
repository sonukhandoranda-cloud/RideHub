
import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext.jsx';


const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const  [firstname, setFirstname] = useState('')
  const  [lastname, setLastname] = useState('')
  const [userData, setUserData] = useState({})

  const navigate = useNavigate();

  const {user, setUser} = React.useContext(UserDataContext);

  const submitHandler =async (e) => {
    e.preventDefault();
   const newUser = {
      fullname: {
        firstname:firstname,  
        lastname:lastname
      },
      email:email,  
      password:password
    };
   try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    console.log("SUCESS", response.data);
    if (response.status === 201) {
      const data = response.data
      setUserData(data.user);
      localStorage.setItem('token',data.token);
      setEmail('');
    setPassword('');
    setFirstname('');
    setLastname('');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('First Name:', firstname);
    console.log('Last Name:', lastname);
      navigate('/home');
   } 
       }     catch (error) {
    console.log("AXIOS ERROR FULL", error);
    console.log("AXIOS ERROR MSG", error.message);
    console.log("AXIOS ERROR RESPONSE", error.response?.data);

   }


    
    // Here you can handle the signup logic, e.g., send data to the server
  }
  return (
    <div>
    <div className='p-7 h-screen flex flex-col justify-between'>
       <div>
          <h1 className="text-2xl font-semibold px-4 py-4">
  RideHub
</h1>
      <form onSubmit={(e)=>submitHandler(e)}>
     <h3 className='text-lg font-medium mb-2'>What's your name</h3>
     <div className='flex gap-4' mb-6>
       <input 
        required 
        
        className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border  text-lg placeholder:text-base'
        type="text" 
        placeholder='Firstname' 
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        />

     <input 
        required 
        
        className='bg-[#eeeeee]  w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base'
        type="text" 
        placeholder='Last name' 
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        />
      </div>

        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input 
        required 
        
        className='bg-[#eeeeee] mb-6 rounded px-2 py-2 border w-full text-lg placeholder:text-base'
        type="email" 
        placeholder='email@example.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />


        <h3 className='text-lg font-medium mb-2'>Enter your password</h3>

        <input 
        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
       
        required type="password" 
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button
        className='bg-[#111] text-white font-semibold mb-3 rounded px-2 py-2  w-full text-lg placeholder:text-base'
        >Create account</button>
      
      </form>
      
<p className='text-center'>Already have an account? <Link to ='/login' className='text-blue-600'>Login here</Link></p>
        

       </div>
       <div>
       <p className='text-[10px] leading-tight' >
        By continuing, you consent to get calls, including by automated means, WhatsApp, or SMS messages from RideHub and its affiliates to the mail provided.
       </p>
       </div>

    </div>
  )
    </div>
  )
}

export default UserSignup
