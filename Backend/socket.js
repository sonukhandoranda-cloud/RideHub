const { Server } = require("socket.io");
const Captain = require("./models/captain.model"); 
const User = require("./models/user.model"); 
// path check karna

let io;

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(` Sending message to ${socketId}, messageObject`);

  if (!io || !socketId) return;

  io.to(socketId).emit(
    messageObject.event,
    messageObject.data
  );
};


function initializeSocket(server) {
   io = new Server(server, {
    
    cors: {
      origin:'*',
      
      methods: ["GET", "POST"],
      
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", async (data) => {
        const { userType, userId } = data;

        if (userType === 'captain' && userId) {
            socket.join(userId); 
            await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
            console.log(`Captain ${userId} joined room`); // Use backticks here
        }

        if (userType === 'user' && userId) {
            socket.join(userId);
            await User.findByIdAndUpdate(userId, { socketId: socket.id });
            console.log(`User ${userId} joined room`);
        }
    }); // Yeh 'join' event ka bracket hai

    // Agar koi aur event hai toh yahan likhein
    
 // Yeh io.on("connection") ka bracket hai jo aapka missing hai

  
// socket.on('update-location-captain', async (data) => {
//   const { userId, location } = data;

//   if (!location || !location.ltd || !location.lng) {
//     return socket.emit('error', {
//       message: 'Invalid location data',
//     });
//   }

//   await captainModel.findByIdAndUpdate(userId, {
//     location: {
//       ltd: location.ltd,
//       lng: location.lng,
//     },
//   });
// });


socket.on("captain-location-update", async ({ captainId, lat, lng }) => {

  // ✅ YAHAN LOG LAGAO (try se pehle)
  console.log("🔥 LOCATION EVENT HIT", { captainId, lat, lng });

  try {
    if (!captainId || !lat || !lng) {
      console.log("❌ Missing data", { captainId, lat, lng });
      return;
    }

    // 1️⃣ Save in DB
    await Captain.findByIdAndUpdate(captainId, {
      location: {
        type: "Point",
        coordinates: [lng, lat], // order important
      },
    });

    // 2️⃣ Emit to users
    socket.broadcast.emit("captain-live-location", {
      captainId,
      lat,
      lng,
    });

    console.log("📡 LOCATION BROADCASTED");

  } catch (err) {
    console.error("❌ Captain location error:", err.message);
  }
});

  socket.on("disconnect", async () => {
    console.log("❌ Socket disconnected:", socket.id);

    // optional cleanup
    await Captain.updateOne(
      { socketId: socket.id },
      { socketId: null }
    );

    await User.updateOne(
      { socketId: socket.id },
      { socketId: null }
    );
  });
  });
}

module.exports = {initializeSocket,sendMessageToSocketId};