const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/map.controller");
const {query} = require('express-validator');

// GET coordinates from address (OSM)
router.get(
  "/get-coordinates",
  
  mapController.getCoordinates
);

router.get(
  "/get-distance-time",
  mapController.getDistanceTime
);
 
router.post("/suggestions", mapController.getSuggestions);


module.exports = router;