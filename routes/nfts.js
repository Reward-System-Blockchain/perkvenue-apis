const express = require('express');
const router = express.Router();

const { NFTStorage } = require("nft.storage");
const Web3 = require("web3");
const { contractAddress, contractABI } = require("../blockchain/constants");
const { mintNFT } = require("../blockchain/mintNFT");



router.get('/',(req,res)=>{
    res.send('We are on nfts');
});


router.post("/mint", async (req, res) => {
    const { name, description, image, addressTo } = req.body;
  
    try {  
      const txHash = await mintNFT(name, description, image, addressTo);
      res.json({ txHash });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });


module.exports = router;