import React from 'react'
import {Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useState } from 'react';
import { useRef } from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap'; 
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import {useEffect,useContext} from 'react'
import {SocketContext} from '../context/SocketContext'
import {CaptainDataContext} from '../context/CaptainContext'
import axios from 'axios';




const CaptainHome = () => {
    console.log("component rendered");

  const [ridePopupPanel, setridePopupPanel] = useState(false)
   const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

  const ridePopupPanelRef = useRef(null)
  const ConfirmRidePopupPanelRef = useRef(null)
  const [ride,setRide]= useState(null)
 
  const {socket} = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

 
  useEffect(() => {
  if (!socket) return;

  const captainId =
    captain?.captain?._id || captain?._id;

  if (!captainId) {
    console.log("⏳ captainId not ready yet");
    return;
  }

  const joinPayload = {
    userType: "captain",
    userId: captainId,
  };

  const join = () => {
    console.log("🔥 EMITTING JOIN EVENT", joinPayload);
    socket.emit("join", joinPayload);
  };

  if (socket.connected) {
    join();
  } else {
    socket.on("connect", join);
  }

  return () => {
    socket.off("connect", join);
  };
}, [socket, captain]);

useEffect(() => {
  const captainId =
    captain?.captain?._id || captain?._id;

  console.log("🧩 useEffect fired", {
    socketConnected: socket?.connected,
    captainId,
  });

  if (!socket || !captainId) {
    console.log("⏳ waiting for socket / captainId");
    return;
  }

  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("📍 sending location (10s):", lat, lng);

        socket.emit("captain-location-update", {
          captainId,
          lat,
          lng,
        });
      },
      (error) => {
        console.error("GPS ERROR:", error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  // 🔁 send every 10 sec
  sendLocation(); // first hit
  const intervalId = setInterval(sendLocation, 10000);

  return () => clearInterval(intervalId);
}, [socket, captain]);
// useEffect(() => {
//   if (!socket || !captain?.captain?._id) return;

//   const updateLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         socket.emit("update-location-captain", {
//           userId: captain.captain._id,
//           ltd: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       });
//     }
//   };

// //   const locationInterval = setInterval(updateLocation, 1000);

//   return () => clearInterval(locationInterval);
// }, [socket, captain?.captain?._id]);
useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
        console.log("🔥 NEW RIDE RECEIVED:", data);
        setRide(data);
        setridePopupPanel(true);
    };

    // Listen for the event
    socket.on("new-ride", handleNewRide);

    return () => {
        socket.off("new-ride", handleNewRide);
    };
}, [socket]); // Ensure socket is stable


async function confirmRide() {

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,{
    ride: ride._id,
    captainId: captain._id,

    
     },{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
     })
  
  
  setridePopupPanel(false)
  setConfirmRidePopupPanel(true)
}

  useGSAP(function(){
    if(ridePopupPanel){
    gsap.to(ridePopupPanelRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(ridePopupPanelRef.current,{
        transform:'translateY(100%)'
    })
}
},[ridePopupPanel])

 useGSAP(function(){
    if(ConfirmRidePopupPanel){
    gsap.to(ConfirmRidePopupPanelRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(ConfirmRidePopupPanelRef.current,{
        transform:'translateY(100%)'
    })
}
},[ConfirmRidePopupPanel])
  
  
  return (
    <div className='h-screen'>
       <div className='fixed p-4 top-0 flex items-center justify-between w-screen'>
         <h1 className="text-2xl font-bold px-4 py-4">
  RideHub
</h1>
         <Link to='/home' className='   h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
       </div>
     <div className='h-3/5'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>
      <div className='h-2/5 p-6'>
      <CaptainDetails />
      </div>
     <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full  bg-white px-3 py-10 pt-12'>
     <RidePopUp 
     ride={ride}
     setridePopupPanel={setridePopupPanel}
      setConfirmRidePopupPanel={setConfirmRidePopupPanel}
      confirmRide={confirmRide}  />
        
        </div>
        <div ref={ConfirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full  bg-white px-3 py-10 pt-12'>
     <ConfirmRidePopUp
     ride={ride}
     setConfirmridePopupPanel= {setConfirmRidePopupPanel}  setridePopupPanel={setridePopupPanel}/>
        
        </div>
        

     </div>
    
  )
}

export default CaptainHome
