const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const {validationResult} = require('express-validator');


module.exports.registerCaptain = async(req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array()});
    }

    const { fullname, email, password, vehicles } = req.body;

    const isCaptainExist = await captainModel.findOne({ email });
    if (isCaptainExist) {
        return  res.status(400).json({ error: 'Captain with this email already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);




    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        colour: vehicles.colour,
        plate: vehicles.plate,
        capacity: vehicles.capacity,
        vehicleType: vehicles.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token,captain });    

}