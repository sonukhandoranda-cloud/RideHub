const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB");

    console.log("Connected DB NAME:", mongoose.connection.name);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToDb;