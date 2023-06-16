const express = require('express');
const router = express.Router();
const { createToken } = require("../blockchain/createToken");
const { getTokenDetails } = require("../blockchain/getTokenDetails");
const { mintTokens } = require("../blockchain/mintTokens");
const { burnTokens } = require("../blockchain/burnTokens");
const {getUserBalance} = require("../blockchain/getUserBalance");

const rewardTokenDetails = require("../model/rewardTokenDetails");

router.get('/',(req,res)=>{
    res.send('We are on tokens');
});

// GET - Get token details

/**
 * @swagger
 * /tokens/details:
 *   get:
 *     summary: Get details of all tokens on the PerkVenue platform.
 *     tags:
 *       - Tokens
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: The total number of tokens matching the query parameters.
 *                 tokenDetails:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RewardTokenDetails'
 *     parameters:
 *       - in: query
 *         name: creator
 *         schema:
 *           type: string
 *         description: Filter the tokens by creator name.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter the tokens by name.
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         description: Filter the tokens by symbol.
 *       - in: query
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         description: Filter the tokens by token address.
 *       - in: query
 *         name: transactionHash
 *         schema:
 *           type: string
 *         description: Filter the tokens by transaction hash.
 *       - in: query
 *         name: tokenId
 *         schema:
 *           type: number
 *         description: Filter the tokens by token ID.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RewardTokenDetails:
 *       type: object
 *       properties:
 *         tokenHash:
 *           type: string
 *           description: The token hash.
 *         tokenId:
 *           type: number
 *           description: The token ID.
 *         tokenAddress:
 *           type: string
 *           description: The token address.
 *         creator:
 *           type: string
 *           description: The token creator.
 *         name:
 *           type: string
 *           description: The token name.
 *         symbol:
 *           type: string
 *           description: The token symbol.
 *         transactionHash:
 *           type: string
 *           description: The transaction hash.
 *
 *     TokenDetailsResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: The total number of tokens matching the query parameters.
 *         tokenDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RewardTokenDetails'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The error message.
 */

// Your route handler implementation
router.get("/details", async (req, res) => {
  const { creator, name, symbol, tokenAddress, transactionHash, tokenId } = req.query;
  const queryObject = {};

  if (creator) {
    queryObject.creator = { $regex: new RegExp(`^${creator}$`, "i") };
  }
  if (name) {
    queryObject.name = { $regex: new RegExp(`^${name}$`, "i") };
  }
  if (symbol) {
    queryObject.symbol = { $regex: new RegExp(`^${symbol}$`, "i") };
  }
  if (tokenAddress) {
    queryObject.tokenAddress = { $regex: new RegExp(`^${tokenAddress}$`, "i") };
  }
  if (transactionHash) {
    queryObject.transactionHash = { $regex: new RegExp(`^${transactionHash}$`, "i") };
  }
  if (tokenId) {
    queryObject.tokenId = tokenId;
  }

  let apiData = rewardTokenDetails.find(queryObject);


  try {

    console.log("Get All Tokens - Query called!");
    const tokenDetails = await apiData;
    res.status(200).json({ total: tokenDetails.length, tokenDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST - Create tokens

/**
 * @swagger
 * /tokens/create:
 *   post:
 *     summary: Create a new token.
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTokenRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTokenResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTokenRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the token.
 *         symbol:
 *           type: string
 *           description: The symbol of the token.
 *         creatorAddress:
 *           type: string
 *           description: The address of the token creator.
 *       example:
 *         name: string
 *         symbol: string
 *         creatorAddress: string
 *
 *     CreateTokenResponse:
 *       type: object
 *       properties:
 *         tokenId:
 *           type: number
 *           description: The ID of the created token.
 *         tokenAddress:
 *           type: string
 *           description: The address of the created token.
 *         name:
 *           type: string
 *           description: The name of the created token.
 *         symbol:
 *           type: string
 *           description: The symbol of the created token.
 *         creatorAddress:
 *           type: string
 *           description: The address of the token creator.
 *         transactionHash:
 *           type: string
 *           description: The transaction hash of the token creation.
 */


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


// POST - Mint tokens

/**
 * @swagger
 * /tokens/mint:
 *   post:
 *     summary: Mint tokens for a specific account address.
 *     tags:
 *      - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MintTokenRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MintTokenResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MintTokenRequest:
 *       type: object
 *       properties:
 *         tokenAddress:
 *           type: string
 *           description: The address of the token to be minted.
 *         accountAddress:
 *           type: string
 *           description: The address of the account to receive the minted tokens.
 *         amount:
 *           type: number
 *           description: The amount of tokens to be minted.
 *       example:
 *         tokenAddress: string
 *         accountAddress: string
 *         amount: number
 *
 *     MintTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The success message indicating the minting details.
 *       example:
 *         message: "19 tokens successfully minted to account: 0xB78721b29c028B16ab25f4a2adE1d25fbf8B2d74 for token: 0xB2AC92a52BcB102a6F5afE4526703E5F4d27eD2b"
 */


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

/**
 * @swagger
 * /tokens/burn:
 *   post:
 *     summary: Burn a certain amount of tokens associated with a specific account address.
 *     tags:
 *      - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BurnTokenRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BurnTokenResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BurnTokenRequest:
 *       type: object
 *       properties:
 *         tokenAddress:
 *           type: string
 *           description: The address of the token to be burnt.
 *         accountAddress:
 *           type: string
 *           description: The address of the account from which the tokens will be burnt.
 *         amount:
 *           type: number
 *           description: The amount of tokens to be burnt.
 *       example:
 *         tokenAddress: string
 *         accountAddress: string
 *         amount: number
 *
 *     BurnTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The success message indicating the burning details.
 *       example:
 *         message: "100 tokens successfully burnt from account: 0x5991fd6Ecc5634C4de497b47Eb0Aa0065fffb214 for token: 0x519E5C658d61AeC3369B4289300379ad9b5E7558"
 */


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

// GET - Get Token Details from Token Address

/**
 * @swagger
 * /tokens/getDetails/{tokenAddress}:
 *   get:
 *     summary: Get details of a specific token.
 *     tags:
 *      - Tokens
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: The address of the token to get details for.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenDetailsResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TokenDetailsResponse:
 *       type: object
 *       properties:
 *         tokenDetails:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the token.
 *             symbol:
 *               type: string
 *               description: The symbol of the token.
 *             creator:
 *               type: string
 *               description: The creator of the token.
 *             totalSupply:
 *               type: string
 *               description: The total supply of the token.
 *           example:
 *             name: "Token Name"
 *             symbol: "TKN"
 *             creator: "Creator Address"
 *             totalSupply: "1000"
 */


router.get("/getDetails/:tokenAddress", async (req, res) => {
  const { tokenAddress } = req.params;

  try {
    const tokenDetails = await getTokenDetails(tokenAddress);
    res.status(200).json({ tokenDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET - Get User Balance from Token Address

/**
 * @swagger
 * /tokens/getDetails/{tokenAddress}/{userAddress}:
 *   get:
 *     summary: Get the token balance of a user.
 *     tags:
 *      - Tokens
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: The address of the token.
 *       - in: path
 *         name: userAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: The address of the user.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBalanceResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserBalanceResponse:
 *       type: object
 *       properties:
 *         userBalance:
 *           type: string
 *           description: The balance of the user.
 *       example:
 *         userBalance: "100"
 */


router.get("/getDetails/:tokenAddress/:userAddress", async (req, res) => {
  const { tokenAddress, userAddress } = req.params;

  try {
    const userBalance = await getUserBalance(tokenAddress, userAddress);
    res.status(200).json({ userBalance });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;