const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");
const bodyParser = require("body-parser");

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

app.use("/post", postsRoute);

//Routes
app.get("/", (req, res) => {
  res.send("We are on home");
});

app.post("/nfts/mint", async (req, res) => {
  const { name, description, image, addressTo } = req.body;

  try {
    //Connect to DB
    await mongoose
      .connect(process.env.DB_CONNECTION)
      .then(() => console.log("Connected to DB"));

    const txHash = await mintNFT(name, description, image, addressTo);
    res.json({ txHash });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
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