import React from 'react'



const RidePopUp = (props) => {
  console.log("ridePopUp props:",props);

  if (!props.ride) return null;
  return (
    <div>
     <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
        props.setridePopupPanel(false)
     }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
        <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg  mt-4'>
            <div className=' flex items-center gap-3  '>
                <img className='h-10 rounded-full object-cover w-12' src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/35af6a41332353.57a1ce913e889.jpg" alt="" />
              <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
            </div>
            <h5 className='text-lg font-semibold'> 2.2 KM </h5>
        </div>
        <div className='flex gap-2 justify-between flex-col items-center'>
             <div className='w-full mt-5'>
       <div className='flex items-center gap-5 p-3 border-b-2'>
        <i className="ri-map-pin-2-fill"></i>
        <div>
            <h3 className='text-lg font-medium'>562/11-A</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup?.lat}, {props.ride?.pickup?.lng}</p>
        </div>
       </div>
       <div className='flex items-center gap-5 p-3 border-b-2'> 
        <i className="ri-map-pin-user-fill"></i>
        <div>
            <h3 className='text-lg font-medium'>562/11-A</h3>
            <p className='text-sm -mt-1 text-gray-600'> {props.ride?.destination?.lat}, {props.ride?.destination?.lng}</p>
        </div>
        </div>
        
        
           <div className='flex items-center gap-5 p-3 '>
        <i className="ri-currency-line"></i>
        <div>
            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash,cash</p>
        </div>
         </div >
        </div>
       
        </div>
        <div className=' mt-5  w-full  items-center justify-between'>
          <button onClick ={() => {
             props.setConfirmRidePopupPanel(true)
             props.confirmRide()
          
        }} 
        className='  bg-green-600 text-white font-semibold p-3  px-10 rounded-lg '>Accept Ride</button>
        
        <button onClick ={() => {
          props.setridePopupPanel(false)
          
        }} 
        className=' mt-1 bg-gray-200 text-gray-700 font-semibold p-3 px-10 rounded-lg '>Ignore</button>
        
        
        </div>
        </div>
        
    
  )
}

export default RidePopUp
