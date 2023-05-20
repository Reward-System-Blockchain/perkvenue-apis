const express = require("express");
const router = express.Router();

const { NFTStorage } = require("nft.storage");
const Web3 = require("web3");
const { contractAddress, contractABI } = require("../blockchain/constants");
const { mintNFT } = require("../blockchain/mintNFT");
const nftDetails = require("../model/nftDetails");

router.get("/", (req, res) => {
  res.send("We are on nfts");
});

// router.options('/nfts/mint', (req, res) => {
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.status(200).send();
// });
// POST
router.post("/mint", async (req, res) => {
  const { name, description, image, addressTo } = req.body;

  try {
    const nftDetails = await mintNFT(name, description, image, addressTo);
    res.status(200).json({ nftDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET
router.get("/details", async (req, res) => {
  const query = req.query;
  console.log(query);
  queryObject={};

  try {
    // const nfts = await nftDetails.find( {
    //   $or: [
    //     {},
    //     { _id: query.id },
    //     { owner: query.owner },
    //     { tokenAddress: query.tokenAddress },
    //     { isOnSale: query.isOnSale },
    //     { price: query.price },
    //     { timestamp: query.timestamp },
    //     {tokenID: query.tokenId}
    //   ]
    // } );

    // console.log(nfts);
    // res.status(200).json({ nfts });
    if (query.id) {
      queryObject._id = query.id;
    }
    if (query.owner) {
      queryObject.owner = query.owner;
    }
    if (query.tokenAddress) {
      queryObject.tokenAddress = query.tokenAddress;
    }
    if (query.isOnSale) {
      queryObject.isOnSale = query.isOnSale;
    }
    if (query.price) {
      queryObject.price = query.price;
    }
    if (query.timestamp) {
      queryObject.timestamp = query.timestamp;
    }
    if (query.tokenId) {
      queryObject.tokenID = query.tokenId;
    }
    if (query.priceGreaterThan) {
      queryObject.price = { $gt: query.priceGreaterThan };
    }
    if (query.priceLessThan) {
      queryObject.price = { $lt: query.priceLessThan };
    }
    if(query.priceGreaterThan && query.priceLessThan){
      queryObject.price = { $gt: query.priceGreaterThan, $lt: query.priceLessThan };
    }
    if (query.timestampGreaterThan) {
      queryObject.timestamp = { $gt: query.timestampGreaterThan };
    }
    if (query.timestampLessThan) {
      queryObject.timestamp = { $lt: query.timestampLessThan };
    }
    if(query.timestampGreaterThan && query.timestampLessThan){
      queryObject.timestamp = { $gt: query.timestampGreaterThan, $lt: query.timestampLessThan };
    }
    {
      const nfts = await nftDetails.find(queryObject);
      res.status(200).json(nfts);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
