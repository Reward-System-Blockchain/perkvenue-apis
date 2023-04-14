const express = require('express'); 
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');
const bodyParser = require('body-parser');

//Middle ware
app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

//Routes
app.get('/',(req,res)=>{
    res.send('We are on home');
});


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION).then(()=>console.log('Connected to DB'))

//create a listening port
app.listen(3000);