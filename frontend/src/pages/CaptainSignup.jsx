import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const CaptainSignup = () => {
  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const  [firstname, setFirstname] = useState('')
    const  [lastname, setLastname] = useState('')
    const [userData, setUserData] = useState({})
    const submitHandler = (e) => {
      e.preventDefault();
      setUserData({
        fullName: {
          firstname:firstname,
          lastname:lastname
        },
        email:email,
        password:password 
        })
  
      console.log(userData);
      setEmail('');
      setPassword('');
      setFirstname('');
      setLastname('');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('First Name:', firstname);
      console.log('Last Name:', lastname);
      // Here you can handle the signup logic, e.g., send data to the server
    }
  return (
    <div>
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
       <div>
         <img className='w-16  mb-3' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s" alt="" />
      <form onSubmit={(e)=>submitHandler(e)}>
     <h3 className='text-lg w-full font-medium mb-2'>What's our captain's name</h3>
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

        <h3 className='text-lg font-medium mb-2'>What's our captain's email</h3>
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
        >Login</button>
      
      </form>
      
<p className='text-center'>Already have an account? <Link to ='/captain-login' className='text-blue-600'>Login here</Link></p>
        

       </div>
       <div>
       <p className='text-[10px] leading-tight' >
        This site is protected by reCAPTCHA and <span className='underline'> the Google privacy policy </span>  and <span className='underline'>terms of service apply.</span>
       </p>
       </div>

    </div>
  )
    </div>
  )
}

export default CaptainSignup
