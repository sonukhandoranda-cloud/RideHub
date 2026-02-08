const axios = require("axios");
const captainModel = require('../models/captain.model');

async function getAddressCoordinate(address) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "uber-clone-backend",
      },
    }
  );

  if (!response.data || response.data.length === 0) {
    throw new Error("No location found");
  }

  return {
    lat: Number(response.data[0].lat),
    lng: Number(response.data[0].lon),
  };
}

async function getDistanceTime(origin, destination) {
  const [originLat, originLng] = origin.split(",");
  const [destLat, destLng] = destination.split(",");

  const response = await axios.get(
    `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}`,
    { params: { overview: false } }
  );

  if (!response.data || response.data.routes.length === 0) {
    throw new Error("No route found");
  }

  const route = response.data.routes[0];

  return {
    distance_km: (route.distance / 1000).toFixed(2),
    duration_min: (route.duration / 60).toFixed(2),
  };
}


  
const mongoose = require("mongoose");

// 🔹 Custom POI search from MongoDB
async function searchCustomPOI(query) {
  return await mongoose.connection
    .collection("custom_pois") // 👈 MongoDB collection name
    .find({
      name: { $regex: query, $options: "i" }
    })
    .limit(5)
    .toArray();
}

// 🔹 OSM Nominatim search
async function searchNominatim(query) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5,
        countrycodes: "in"
      },
      headers: {
        "User-Agent": "uber-clone-college-project"
      }
    }
  );

  return response.data;
}

// 🔹 MAIN function (controller yahi call karega)
async function getSuggestions(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchQuery = query.trim();

  // 1️⃣ Custom POI results
  const customPOIResults = await searchCustomPOI(searchQuery);

  // 2️⃣ OSM results
  const nominatimResults = await searchNominatim(searchQuery);

  // 3️⃣ Merge both
  return [
    ...customPOIResults.map(poi => ({
      name: poi.name,
      lat: poi.lat,
      lng: poi.lng,
      source: "custom"
    })),
    ...nominatimResults.map(place => ({
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
      source: "osm"
    }))
  ];
}

async function getCaptainsInTheRadius(lat, lng, radius) {
  try {
    console.log("📍 Finding captains near:", lat, lng, "radius:", radius, "km");

    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],          // ⚠️ order MUST be [lng, lat]
            radius / 6378.1      // ✅ KM → radians
          ]
        }
      },
             // optional but recommended
    });

    console.log("✅ Captains found:", captains.length);
    return captains;

  } catch (error) {
    console.error("❌ Error finding captains:", error.message);
    throw error;
  }
}

module.exports = {
  getAddressCoordinate,
  getDistanceTime,
  getSuggestions,
  getCaptainsInTheRadius
};


// reverse geocode

async function reverseGeocode(lat, lng) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
      headers: {
        "User-Agent": "uber-clone-backend",
      },
    }
  );

  if (!response.data) {
    throw new Error("Unable to fetch address");
  }

  return {
    address: response.data.display_name,
    lat: Number(lat),
    lng: Number(lng),
  };
}