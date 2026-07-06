import React from 'react'
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] h-screen pt-8  flex justify-between flex-col w-full '>
      
        <h1 className="text-2xl font-bold px-4 py-4">
  RideHub
</h1>
        <div className='bg-white pb-7 py-4 px-4'>
            <h2 className='text-[30px] font-semibold'>Get Started with RideHub</h2>
        <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-2  rounded-lg mt-5'>Continue</Link></div>
      
    </div>
  )
}

export default Start
