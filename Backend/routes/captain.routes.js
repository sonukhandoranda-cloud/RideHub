const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const {body} = require("express-validator");


router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6}).withMessage('password must be atleast 6 characters long'),
    body('vehicles.colour').isLength({ min: 3}).withMessage('vehicle colour must be atleast 3 characters long'),
    body('vehicles.plate').isLength({ min: 3}).withMessage('vehicle plate must be atleast 3 characters long'),
    body('vehicles.capacity').isInt({ min: 1}).withMessage('capacity must be atleast 1'),
    body('vehicles.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Invalid vehicle type'),
],
 captainController.registerCaptain
);





module.exports = router;