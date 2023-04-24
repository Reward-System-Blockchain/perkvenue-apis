const express = require('express');
const router = express.Router();
const { createToken } = require("../blockchain/createToken");
const { getAllTokens } = require("../blockchain/getAllTokens");
const { getTokenDetails } = require("../blockchain/getTokenDetails");
const { mintTokens } = require("../blockchain/mintTokens");
const { burnTokens } = require("../blockchain/burnTokens");



router.get('/',(req,res)=>{
    res.send('We are on tokens');
});

// POST - Create tokens
router.post("/create", async (req, res) => {
    const { name, symbol, creatorAddress } = req.body;

    try {
      const tokenDetails = await createToken(creatorAddress, name, symbol);
      res.status(200).json({ tokenDetails });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
});

// POST - Get Token Details from Token Address
router.post("/getDetails", async (req, res) => {
  const { tokenAddress } = req.body;

  try {
    const tokenDetails = await getTokenDetails(tokenAddress);
    res.status(200).json({ tokenDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST - Mint tokens
router.post("/mint", async (req, res) => {
  const { tokenAddress, accountAddress, amount } = req.body;

  try {
    const mintingDetails = await mintTokens(tokenAddress, accountAddress, amount);
    res.status(200).json({ mintingDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - Burn tokens
router.post("/burn", async (req, res) => {
  const { tokenAddress, accountAddress, amount } = req.body;

  try {
    const burningDetails = await burnTokens(tokenAddress, accountAddress, amount);
    res.status(200).json({ burningDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Get token details
router.get("/details", async (req, res) => {
  const query = req.query;
  console.log(query);

  try {
    const tokenDetails = await getAllTokens();
    res.status(200).json({ tokenDetails });
    // console.log(nfts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;