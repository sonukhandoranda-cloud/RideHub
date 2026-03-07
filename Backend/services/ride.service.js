const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket');



/* ---------------- GET FARE ---------------- */
async function getFare(pickupAddress, destinationAddress) {
  if (!pickupAddress || !destinationAddress) {
    throw new Error("Pickup and destination are required");
  }

  const pickupCoords = await mapService.getAddressCoordinate(pickupAddress);
  const destinationCoords = await mapService.getAddressCoordinate(destinationAddress);

  const pickupStr = `${pickupCoords.lat},${pickupCoords.lng}`;
  const destinationStr = `${destinationCoords.lat},${destinationCoords.lng}`;

  const distanceTime = await mapService.getDistanceTime(
    pickupStr,
    destinationStr
  );

  const distanceKm = Number(distanceTime.distance_km);
  const durationMin = Number(distanceTime.duration_min);

  const baseFare = { auto: 30, car: 50, motor: 20 };
  const perKmRate = { auto: 10, car: 15, motor: 8 };
  const perMinuteRate = { auto: 2, car: 3, motor: 1 };

  const fare = {};
  for (let type in baseFare) {
    fare[type] =
     Math.round(baseFare[type] +
      distanceKm * perKmRate[type] +
      durationMin * perMinuteRate[type])                                                                                                                                        ;
  }

  return { fare, pickupCoords, destinationCoords };
}
 
module.exports= {getFare};

// Otp

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
        return otp;
    }

    return generateOtp(num);
}

/* ---------------- CREATE RIDE ---------------- */
async function createRide({ user, pickup, destination, vehicleType }) {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const { fare, pickupCoords, destinationCoords } =
    await getFare(pickup, destination);

  if (!fare[vehicleType]) {
    throw new Error("Invalid vehicle type");
  }

  const ride = await rideModel.create({
    user,
    pickupAddress: pickup,
    destinationAddress: destination,
    pickup: pickupCoords,
    destination: destinationCoords,
    vehicleType,
    otp:getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
}

async function confirmRide({ rideId, captain }) {
  if (!rideId) throw new Error('Ride id is required');
  if (!captain || !captain._id) {
    throw new Error('Captain object with _id is required');
  }

  await rideModel.findOneAndUpdate(
    { _id: rideId },
    {
      status: 'accepted',
      captain: captain._id
    },
    {new: true}
  );
    
  

  const ride = await rideModel
    .findOne({ _id: rideId })
    .populate('user')
    .populate('captain').select('+otp');
    
    

  if (!ride) throw new Error('Ride not found');
   
  console.log("emittting to room",ride.user._id);
  
  return ride;
}

async function startRide({ ride, otp, captain }) {
  // 1️⃣ Validation
  

  // 2️⃣ Find ride + populate
  const rideData = await rideModel
    .findOne({ _id: ride })
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!rideData) {
    throw new Error('Ride not found');
  }

  // 3️⃣ Ride status check
  if (rideData.status !== 'accepted') {
    throw new Error('Ride not accepted');
  }

  // 4️⃣ OTP verification
  if (rideData.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  // 5️⃣ Update ride status
  await rideModel.findOneAndUpdate(
    { _id: ride},
    { status: 'ongoing' }
  );

  // 6️⃣ Notify user via socket
  if (rideData.user?.socketId) {
     console.log("CONNECTED socket in termibal:", rideData.user.socketId);
    sendMessageToSocketId(rideData.user.socketId, {
      event: 'ride-started',
      data: rideData
    });
  }

  // 7️⃣ Return updated ride
  return rideData;
}

async function endRide({ ride, captain }) {
  if (!ride) {
    throw new Error('Ride id is required');
  }
  if (!captain) {
    throw new Error('Captain is required');
  }
  const rideData = await rideModel.findOneAndUpdate(
  { _id: ride, captain: captain._id },
  { status: 'completed' },
  { new: true }
).populate('user');

  if (!rideData) {
    throw new Error('Ride not found or not assigned to this captain');
  }

  return rideData;
}



/* ---------------- EXPORT ---------------- */
module.exports = {
  createRide,getFare,confirmRide,startRide,endRide
};

