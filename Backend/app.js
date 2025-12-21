const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const  cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res) => {
    res.send('Hello world');
})

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);



app.listen(3000,() => {
    console.log(`server is running http://localhost:3000`);
});
  
module.exports = app;