const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require('cors');
// -----------------------------------------------//

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig.js');

//Middle ware
app.use(bodyParser.json());

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

const nftsRoute = require("./routes/nfts");
const tokenRoute = require("./routes/tokens");


app.use("/nfts", nftsRoute);
app.use("/tokens", tokenRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Routes
app.get("/", (req, res) => {
  res.send("We are on home");
});



//create a listening port
const start = async () => {
  try {
    //Connect to DB
    await mongoose
      .connect(process.env.DB_CONNECTION,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
      .then(() => console.log("Connected to DB"));
    app.listen(3000, () => {
      console.log("Server is live!");
      console.log(`3000 is the magic port!`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();