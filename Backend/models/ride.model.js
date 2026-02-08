const mongoose = require("mongoose");

 const coordinateSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  captain: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'captain',
  default: null
},

  pickupAddress: {
    type: String,
    required: true,
  },

  destinationAddress: {
    type: String,
    required: true,
  },

  pickup: {
    type: coordinateSchema,
    required: true,
  },

  destination: {
    type: coordinateSchema,
    required: true,
  },

  vehicleType: {
    type: String,
    enum: ["auto", "car", "motor"],
    required: true,
  },

  fare: {
    type: Number,
    required: true,
  },

  distance: {
    type: Number, // km
  },

  duration: {
    type: Number, // seconds
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "started", "completed", "cancelled"],
    default: "pending",
  },


    paymentId: {
      type: String
    },

    orderId: {
      type: String
    },

    signature: {
      type: String
    },
  
  otp: {
    type: String,
    select: false,
    required: true,

  }
}
);

module.exports = mongoose.model("ride", rideSchema);