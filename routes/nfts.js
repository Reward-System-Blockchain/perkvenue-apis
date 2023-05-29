const express = require("express");
const router = express.Router();

const { NFTStorage } = require("nft.storage");
const Web3 = require("web3");
const { contractAddress, contractABI } = require("../blockchain/constants/constants");
const { mintNFT } = require("../blockchain/mintNFT");
const nftDetails = require("../model/nftDetails");
const NFTcollectionDetails = require("../model/NFTcollectionDetails");
const { deployNFTCollection } = require("../blockchain/deployNFTCollection");
const { mintFromCollection } = require("../blockchain/mintFromCollection");

router.get("/", (req, res) => {
  res.send("We are on nfts");
});



//POST
router.post("/mintFromCollection", async (req, res) => {
  const { contractAddress, name, description, image, addressTo } = req.body;

  try {
    const nftDetails = await mintFromCollection(contractAddress, name, description, image, addressTo);
    res.status(200).json({ nftDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST
router.post("/deploycollection", async (req, res) => {
  const { name, symbol, maxSupply } = req.body;

  try {
    const contractAddress = await deployNFTCollection(name, symbol, maxSupply);
    res.status(200).json({ contractAddress });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get collection details
router.get("/collectionDetails", async (req, res) => {
  const { contractAddress, name, symbol, sort, select} =
    req.query;
  const queryObject = {};

  if (contractAddress) {
    queryObject.contractAddress = new RegExp(`^${contractAddress}$`, "i");
  }
  if (name) {
    queryObject.name = new RegExp(`^${name}$`, "i");
  }
  if (symbol) {
    queryObject.symbol = new RegExp(`^${symbol}$`, "i");
  }

  let apiData = NFTcollectionDetails.find(queryObject);

  if (sort) {
    apiData = apiData.sort(sort.replace(/,/g, ' '));
  }
  if (select) {
    apiData = apiData.select(select.replace(/,/g, ' '));
  }

  console.log("NFT Collection - Query called!");

  const collections = await apiData;
  res.status(200).json({ total: collections.length, collections });
});

//---------------------------------------------------------//


router.post("/quickmint", async (req, res) => {
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
