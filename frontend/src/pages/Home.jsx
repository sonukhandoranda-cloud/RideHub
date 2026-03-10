import React from 'react'
import { useState } from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import axios from 'axios';
import {SocketContext}  from '../context/SocketContext';
import { useContext }   from 'react';
import { useEffect }  from 'react';
import  {UserDataContext}  from '../context/UserContext';
import {useNavigate} from 'react-router-dom';
import LiveTracking from "../components/LiveTracking";



const Home = () => {
    console.log("Home componenet rendered");
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');  
    const [panelOpen, setPanelOpen] = useState(false);
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const  [confirmRidePanel, setConfirmRidePanel] =useState(false)
    const  [vehicleFound, setVehicleFound] =useState(false)
     const  [waitingForDriver, setWaitingForDriver] =useState(false)
     const [pickupSuggestions, setPickupSuggestions] = useState([])
const [destinationSuggestions, setDestinationSuggestions] = useState([])
const [activeField, setActiveField] = useState(null)
const [fare, setFare] = useState(null);
const [vehicleType, setVehicleType ] = useState(null)
const [ride, setRide] = useState(null);

const navigate = useNavigate();
const [captains,setCaptains] = useState(null);

const  {socket } = useContext(SocketContext)
const {user} = useContext(UserDataContext);

const pickupTimer = useRef(null);
const destinationTimer = useRef(null);
console.log("User In HOME", user);



useEffect(() => {
  if (!socket || !user) return;

  if (socket.connected) {
    socket.emit("join", {
      userType: "user",
      userId: user._id,
    });
  } else {
    socket.on("connect", () => {
      socket.emit("join", {
        userType: "user",
        userId: user._id,
      });
    });
  }
}, [socket, user]);

useEffect(() => {
    // Jab tak user ya user._id nahi mil jati, join mat karo
    if (user && user._id && socket) {
        console.log("Joining room with ID:", user._id);
        socket.emit('join', { userType: 'user', userId: user._id });
    }

    const handleRideAccepted = (data) => {
        console.log("RIDE ACCEPTED EVENT CAME!", data);
        const finalData = data.ride?.ride ? data.ride.ride : data.ride;
        setRide(finalData);
        setWaitingForDriver(true);
        setVehicleFound(false);
    };

    socket.on('ride-accepted', handleRideAccepted);

    return () => {
        socket.off('ride-accepted', handleRideAccepted);
    };
}, [user, socket]); 
// Dependency array mein user zaroori hai

socket.on('ride-started', ride=>{
  setWaitingForDriver(false);
  
  navigate('/riding', { state: { ride } });
});

const handlePickupChange = async (e) => {
  const value = e.target.value;
  setPickup(value);
  setActiveField('pickup');
  setPanelOpen(true);

  clearTimeout(pickupTimer.current);

pickupTimer.current = setTimeout(async () => {

  if (value.length < 3) return;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/maps/suggestions`,
      { query: value },
      {
        headers: {
          'User-Agent': 'uber-clone-college-project'
        }
      }
    );

    setPickupSuggestions(response.data);

  } catch (error) {
    console.error('Pickup error:', error);
  }

}, 700);

}
const handleDestinationChange = async (e) => {
    const value = e.target.value;

  setDestination(value);
  setActiveField('destination');
  setPanelOpen(true);

   clearTimeout(destinationTimer.current);

destinationTimer.current= setTimeout(async () => {

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/maps/suggestions`,
      { query: value }
    );

    setDestinationSuggestions(response.data);

  } catch (error) {
    console.error('Destination error', error);
  }

}, 700);
}



    const submitHandler = (e) => {
        e.preventDefault();
        // handle form submission logic here
    }


    useGSAP(function(){
        if(panelOpen){
            gsap.to(panelRef.current, {
                height: '70%',
                padding:24
                // opacity:1
            });
            gsap.to(panelCloseRef.current, {
                opacity: 1
            });
        }else{
            gsap.to(panelRef.current, {
                height: '0%',
                padding:0
                // opacity:0
            });
            gsap.to(panelCloseRef.current, {
                opacity: 0
            });
        }
    },[panelOpen])


useGSAP(function(){
    if(vehiclePanel){
    gsap.to(vehiclePanelRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(vehiclePanelRef.current,{
        transform:'translateY(100%)'
    })
}
},[vehiclePanel])

useGSAP(function(){
    if(confirmRidePanel){
    gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(100%)'
    })
}
},[confirmRidePanel])

useGSAP(function(){
    if(vehicleFound){
    gsap.to(vehicleFoundRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(vehicleFoundRef.current,{
        transform:'translateY(100%)'
    })
}
},[vehicleFound])

useGSAP(function(){
    if(waitingForDriver){
    gsap.to(waitingForDriverRef.current,{
        transform:'translateY(0%)'
    })
} else{
    gsap.to(waitingForDriverRef.current,{
        transform:'translateY(100%)'
    })
}
},[waitingForDriver])

async function findTrip(){
     setVehiclePanel(true);
     setPanelOpen(false);

     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-Fare`,{
        params: { pickup, destination},
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
     })

     console.log(response.data)
     setFare(response.data.fare);
}

async function createRide() {
  if (!pickup || !destination || !vehicleType) {
    console.error("Missing ride data");
    return;
  }

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/rides/create`,
    { pickup, destination, vehicleType },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  console.log(response.data);
}

  return (
    <div className='h-screen relative'>
      <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
      
      <div className='h-screen w-screen'>
        {/* image for temp use */}
        <LiveTracking />
      </div>

      <div className='flex flex-col justify-end h-screen absolute top-0 w-full '>

        <div className='h-[30%] p-6 bg-white relative'>
            <h5 ref = {panelCloseRef} onClick={()=>{
                setPanelOpen(false)
            }} className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-s-line"></i>
            </h5>
            

        <h4 className='text-2xl font-semibold'>Find a  trip</h4>
        <form onSubmit={(e)=>{
            submitHandler(e);
        }}>
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
            <input
  onClick={() => {
    setPanelOpen(true)
    setActiveField('pickup')
  }}
  value={pickup}
  onChange={handlePickupChange}   // ✅ VERY IMPORTANT
  className="bg-[#eeee] px-12 py-2 text-lg rounded-lg"
  type="text"
  placeholder="Add a pickup location"
/>
            <input
  onClick={() => {
    setPanelOpen(true);
    setActiveField('destination');
  }}
  value={destination}
  onChange={handleDestinationChange}
  className="bg-[#eee] px-12 py-2 text-lg mt-3 rounded-lg"
  type="text"
  placeholder="Enter your destination"
/>
</form>
<button  onClick ={ findTrip} className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>Find Trip</button>
</div>

<div ref={panelRef} className="bg-white h-0">
  <LocationSearchPanel
    suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
    setPanelOpen={setPanelOpen}
    setVehiclePanel={setVehiclePanel}
    setPickup={setPickup}
    setDestination={setDestination}
    activeField={activeField}
  />
</div>
      
    
    
      </div>
      
       
      
      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>

        <VehiclePanel 
         createRide={createRide}
        setVehicleType={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}/>
        </div>
        
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>

        <ConfirmRide 
         createRide={createRide}
         pickup={pickup}
         destination={destination}
         fare={fare}
         vehicleType={vehicleType}
          
        setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
        </div>
           
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>

        <LookingForDriver
         createRide={createRide}
         pickup={pickup}
         destination={destination}
         fare={fare}
         vehicleType={vehicleType}
          setVehicleFound={setVehicleFound} />
        </div>
        
        <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0  bg-white px-3 py-6 pt-12'>
{(waitingForDriver && ride) &&
        <WaitingForDriver 
        ride={ride}
        captains={captains}
        setVehicleFound={setVehicleFound}
        setWaitingForDriver={setWaitingForDriver}
        waitingForDriver={waitingForDriver}/>}
        </div>
         
         <div  className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>

        
        </div>
    </div>
 )
}

export default Home







