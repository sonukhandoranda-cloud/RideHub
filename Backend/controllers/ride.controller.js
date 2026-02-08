const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService =require('../services/maps.service');
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
  console.log("🟢 CREATE RIDE API HIT");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

 try {
  const ride = await rideService.createRide({
    user: req.user._id,
    pickup,
    destination,
    vehicleType
  });

  const pickupCoordinates =
    await mapService.getAddressCoordinate(pickup);
  console.log("📍 Pickup coords:", pickupCoordinates);

  const captainsInRadius =
    await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      6 
    );

  console.log("🚖 Captains in radius:", captainsInRadius.length);

  // 🔹 OTP remove (user ko bhejne se pehle)
// OTP remove
ride.otp = "";

// ride + user full details
const rideWithUser = await rideModel
  .findById(ride._id)
  .populate("user"); // 👈 full user document

captainsInRadius.forEach((captain) => {
    // Send to the room named after the Captain's ID
    sendMessageToSocketId(captain._id.toString(), { 
        event: 'new-ride',
        data: rideWithUser,
    });
});
 
// 🔹 LAST me response return karo
 

  // ✅ return LAST me
  return res.status(201).json({
    ride,
    captainsFound: captainsInRadius.length,
    captains: captainsInRadius
  });

   

} catch (err) {
  console.error(err);
  return res.status(400).json({ message: err.message });
}
}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.confirmRide = async function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    console.log("CONFIRM RIDE");
    const { ride } = req.body;

    if (!ride) {
      return res.status(400).json({
        message: "Ride id is required",
      });
    }

    const confirmedRide = await rideService.confirmRide({
      rideId: ride,
      captain: req.captain._id,
    });

   // ✅ USER FROM RIDE

   sendMessageToSocketId(
  confirmedRide.user.socketId,
  {
    event: "ride-accepted",
    data: {
      ride: confirmedRide,
    },
  }
);


    return res.status(200).json(confirmedRide);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.startRide = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const {  rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({ rideId, otp, captain: req.captain._id });
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride
    });
    return res.status(200).json(ride);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
    
  }