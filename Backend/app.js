const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const  cors = require('cors');
const app = express();

app.use(cors());


app.get('/',(req,res) => {
    res.send('Hello world');
})


app.listen(3000,() => {
    console.log(`server is running http://localhost:3000`);
});
  
module.exports = app;