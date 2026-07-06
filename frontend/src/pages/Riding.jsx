import React,{useEffect,useContext} from 'react'

import {Link, useLocation } from 'react-router-dom'
import {SocketContext} from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';


const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;
 
  const {socket}= useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
   if (!socket) return;

   const handleRideEnded = (data) => {
      console.log("Ride ended data:", data);
      navigate('/home');
   };

   socket.on('ride-ended', handleRideEnded);

   return () => {
      socket.off('ride-ended', handleRideEnded);
   };

}, [socket, navigate]);


  
  
  useEffect(() => {
    if (!socket) return;

    socket.on("captain-live-location", (data) => {
      console.log("Captain live location:", data);
      
    });

    return () => {
      socket.off("captain-live-location");
    };
  }, [socket]);


  return (
    <div className='h-screen relative'>
        <Link to='/home' className='fixed right-2 top-2  h-10 w-10 bg-white flex items-center justify-center rounded-full z-20'>
            <i className="text-lg font-medium ri-home-5-line"></i>
        </Link>
     <div className='absolute top-0 left-0 w-full h-[60%]'>
        <LiveTracking />
      </div>
      <div className="absolute -bottom-12 w-full bg-white pt-0 px-2 pb-6 rounded-t-3xl">
      <div className='flex-1 p-4 pb-8'>
       <div className='flex items-center justify-between'>
         <h1 className="text-2xl font-semibold px-4 py-4">
  RideHub
</h1>
        <div className='text-right'>
            <h2 className='text-lg font-medium capitalize'>{ride?.captain?.fullname?.firstname}</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain?.vehicles?.plate}</h4>
              <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
        </div>
       </div>
        <div className='flex gap-2 justify-between flex-col items-center'>

        <div className='w-full mt-5'>
       
       <div className='flex items-center gap-5 p-3 border-b-2'> 
        <i className="ri-map-pin-user-fill"></i>
        <div>
            <h3 className='text-lg font-medium'>562/11-A</h3>
            <p className='text-sm -mt-1 text-gray-600'>{ride?.destinationAddress}</p>
        </div>
        </div >
           <div className='flex items-center gap-5 p-3 '>
        <i className="ri-currency-line"></i>
        <div>
            <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash,cash</p>
        </div>
        
        </div>
       
        </div>
        
        </div>
       
      <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg '>Make a Payment</button>
         
      </div>
     </div>
    </div>
  )
}

export default Riding
