const mapService = require("../services/maps.service");
const axios = require("axios");


module.exports.getCoordinates = async (req, res, next) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({ message: "Coordinates not found" });
  }
};


module.exports.getDistanceTime = async (req, res) => {
    console.log(req.body);
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({
      message: "Origin and destination are required",
    });
  }

  try {
    const result = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: "Distance and time not found",
      
    });
  }
};



module.exports.getSuggestions = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      message: "Query is required",
    });
  }

  try {
    const suggestions = await mapService.getSuggestions(query);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(404).json({
      message: "No suggestions found",
    });
  }
};