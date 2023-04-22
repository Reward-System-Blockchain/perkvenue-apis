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
    const tokenId = await mintNFT(name, description, image, addressTo);
    res.status(200).json({ tokenId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET
router.get("/mint", async (req, res) => {
  const query = req.query;
  console.log(query);

  try {
    const nfts = await nftDetails.find( { 
      $or: [
        { _id: query.id },
        { owner: query.owner },
        { tokenAddress: query.tokenAddress },
        { isOnSale: query.isOnSale },
        { price: query.price },
        { timestamp: query.timestamp },
        {tokenID: query.tokenId}
      ]
    } );
    
    console.log(nfts);
    res.status(200).json({ nfts });
    // if (query.id) {
    //   try {
    //     const nfts = await nftDetails.find({ _id: query.id });
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else if (query.owner) {
    //   try {
    //     const nfts = await nftDetails.find({ owner: query.owner });
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else if (query.tokenAddress) {
    //   try {
    //     const nfts = await nftDetails.find({
    //       tokenAddress: query.tokenAddress,
    //     });
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else if (query.isOnSale) {
    //   try {
    //     const nfts = await nftDetails.find({ isOnSale: query.isOnSale });
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else if (query.price) {
    //   try {
    //     const nfts = await nftDetails.find({ price: query.price });
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else if (query.timestamp) {
    //   try {
    //     const nfts = await nftDetails.find({ timestamp: query.timestamp });
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else if (query.tokenId) {
    //   try {
    //     const nfts = await nftDetails.find({ tokenID: query.tokenId });
    //     console.log(nfts);
    //     res.status(200).json({ nfts });
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: "Internal server error" });
    //   }
    // } else {
    //   // const nfts = await nftDetails.find();
    //   res.status(200).json("nfts");
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
