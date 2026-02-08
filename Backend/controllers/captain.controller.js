const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const {validationResult} = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.model');


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

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await captain.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({captain: req.captain});
}
module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token ||  req.headers.authorization.split(" ")[1];
    await BlacklistToken.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports.updateCaptainProfile = async (req, res, next) => {

}