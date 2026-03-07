const express = require('express');
const router = express.Router();
const { body,query, validationResult } = require('express-validator');

const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  "/create",
  authMiddleware.authUser,

  body("pickup")
    .isString()
    .notEmpty()
    .withMessage("Pickup address is required"),

  body("destination")
    .isString()
    .notEmpty()
    .withMessage("Destination address is required"),

  body("vehicleType")
    .isIn(["auto", "car", "motor"])
    .withMessage("Invalid vehicle type"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  rideController.createRide
);

router.get(
  '/get-fare',
  authMiddleware.authUser,
  query('pickup')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Invalid pickup location'),
  query('destination')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Invalid destination location'),
  rideController.getFare
);

router.post('/confirm',
  authMiddleware.authCaptain,
  body('ride').isMongoId().withMessage('Invalid ride Id'),
  
  rideController.confirmRide

)
router.get(
  '/start-ride',
  [
    authMiddleware.authCaptain,
    query('ride')
      .isMongoId()
      .withMessage('Invalid ride Id'),
    query('otp')
      .isString()
      .isLength({ min: 6, max: 6 })
      .withMessage('Invalid OTP')
  ],
  rideController.startRide
);

router.post('/end-ride',
  authMiddleware.authCaptain,
  body('ride').isMongoId().withMessage('Invalid ride Id'),
  rideController.endRide
)
module.exports = router;