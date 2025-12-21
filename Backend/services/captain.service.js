const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({
    firstname,lastname,email,password,colour,plate,capacity,vehicleType
}) =>{
    if (!firstname ||!email|| !password || !colour || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
        const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicles: {
            colour,
            plate,
            capacity,
            vehicleType
        }
    });
        return captain;
}