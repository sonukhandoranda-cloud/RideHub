import React from 'react'
import {Link, useLocation } from 'react-router-dom'
import { useState } from 'react';
import { useRef } from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import FinishRide from '../components/FinishRide';
import LiveTracking from '../components/LiveTracking';
const CaptainRiding = () => {

  const [FinishRidePanel,setFinishRidePanel] = useState(false)
  const FinishRidePanelRef = useRef(null)
  const location = useLocation();
  const ride = location.state?.ride;

   useGSAP(function(){
    if(FinishRidePanel){
    gsap.to(FinishRidePanelRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(FinishRidePanelRef.current,{
        transform:'translateY(100%)'
    })
}
},[FinishRidePanel])
  
  return (
    <div className='h-screen w-full relative'>
       
       
         <div className='fixed p-6 top-0 flex items-center justify-end w-screen z-20'>
         <Link to='/captain-home' className='   h-10 w-10 bg-white flex items-center justify-center rounded-full '>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
       </div>
     <div className='absolute top-0 left-0 h-full w-full '>
        <LiveTracking />
      </div>
     <div className='absolute bottom-0 left-0 w-full h-[25%]   bg-yellow-400 px-6 py-5 flex flex-col justify-between z-20'
     onClick={() =>{
      setFinishRidePanel(true)
     }}>
      <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={()=>{
        
     }}><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
       <h4 className='text-xl font-semibold'>4 KM away</h4>
       <button className='  bg-green-600 text-white font-semibold p-3  px-10 rounded-lg '>Complete Ride</button>
     </div>
       <div ref={FinishRidePanelRef} className='fixed w-full z-50 bottom-0 translate-y-full  bg-white px-3 py-10 pt-12'>
     <FinishRide 
     ride={ride}
     setFinishRidePanel={setFinishRidePanel}/>
        </div> 

     </div>
  )
}

export default CaptainRiding
