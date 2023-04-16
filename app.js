const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require('cors');
// -----------------------------------------------//
const { NFTStorage } = require("nft.storage");
const Web3 = require("web3");
const { contractAddress, contractABI } = require("./blockchain/constants");
const { mintNFT } = require("./blockchain/mintNFT");
// -----------------------------------------------//

// const nftDetails = require("./model/nftDetails");

//Middle ware
app.use(bodyParser.json());

//Import Routes
const postsRoute = require("./routes/post");
const nftsRoute = require("./routes/nfts");

app.use("/post", postsRoute);
app.use("/nfts", nftsRoute);
app.use(cors({
  origin: '*',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));


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
    //   getNFTMints();
  } catch (err) {
    console.log(err);
  }
};

start();