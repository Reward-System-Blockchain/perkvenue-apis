const express = require("express");
const router = express.Router();
const { mintNFT } = require("../blockchain/mintNFT");
const nftDetails = require("../model/nftDetails");
const NFTcollectionDetails = require("../model/NFTcollectionDetails");
const { deployNFTCollection } = require("../blockchain/deployNFTCollection");
const { mintFromCollection } = require("../blockchain/mintFromCollection");

router.get("/", (req, res) => {
  res.send("We are on nfts");
});

// GET - NFT Details 

/**
 * @swagger
 * /nfts/details:
 *   get:
 *     summary: Retrieve the details of all/specified non-fungible tokens (NFTs).
 *     tags:
 *       - NFTs
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the NFT to retrieve details for.
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: The owner of the NFTs to retrieve details for.
 *       - in: query
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         description: The address of the NFT tokens to retrieve details for.
 *       - in: query
 *         name: tokenURI
 *         schema:
 *           type: string
 *         description: The tokenURI of the NFT tokens to retrieve details for.
 *       - in: query
 *         name: isOnSale
 *         schema:
 *           type: boolean
 *         description: Specifies if the NFTs should be on sale or not.
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: The price of the NFTs to retrieve details for.
 *       - in: query
 *         name: timestamp
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The timestamp of the NFTs to retrieve details for.
 *       - in: query
 *         name: tokenId
 *         schema:
 *           type: number
 *         description: The token ID of the NFTs to retrieve details for.
 *       - in: query
 *         name: priceGreaterThan
 *         schema:
 *           type: number
 *         description: The minimum price of the NFTs to retrieve details for.
 *       - in: query
 *         name: priceLessThan
 *         schema:
 *           type: number
 *         description: The maximum price of the NFTs to retrieve details for.
 *       - in: query
 *         name: timestampGreaterThan
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The minimum timestamp of the NFTs to retrieve details for.
 *       - in: query
 *         name: timestampLessThan
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The maximum timestamp of the NFTs to retrieve details for.
 *     responses:
 *       200:
 *         description: Success. Returns the details of all/specified NFTs.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NFTDetailsResponse'
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 */

// Define the response schema for NFT details
/**
 * @swagger
 * components:
 *   schemas:
 *     NFTDetailsResponse:
 *       type: object
 *       properties:
 *         tokenHash:
 *           type: string
 *           description: The hash value of the NFT token.
 *         owner:
 *           type: string
 *           description: The owner of the NFT.
 *         tokenID:
 *           type: integer
 *           description: The unique identifier of the NFT.
 *         tokenURI:
 *           type: string
 *           description: The URI of the NFT.
 *         tokenAddress:
 *           type: string
 *           description: The address of the NFT token.
 *         txHash:
 *           type: string
 *           description: The hash value of the transaction related to the NFT.
 *         isOnSale:
 *           type: boolean
 *           description: Indicates if the NFT is currently on sale.
 *         price:
 *           type: number
 *           description: The price of the NFT.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the NFT was created.
 */

router.get("/details", async (req, res) => {
  const query = req.query;
  console.log(query);
  queryObject = {};

  try {
    if (query.id) {
      queryObject._id = query.id;
    }
    if (query.owner) {
      queryObject.owner = { $regex: new RegExp(query.owner, "i") };
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
    if (query.tokenURI) {
      queryObject.tokenURI = query.tokenURI;
    }
    if (query.priceGreaterThan) {
      queryObject.price = { $gt: query.priceGreaterThan };
    }
    if (query.priceLessThan) {
      queryObject.price = { $lt: query.priceLessThan };
    }
    if (query.priceGreaterThan && query.priceLessThan) {
      queryObject.price = { $gt: query.priceGreaterThan, $lt: query.priceLessThan };
    }
    if (query.timestampGreaterThan) {
      queryObject.timestamp = { $gt: query.timestampGreaterThan };
    }
    if (query.timestampLessThan) {
      queryObject.timestamp = { $lt: query.timestampLessThan };
    }
    if (query.timestampGreaterThan && query.timestampLessThan) {
      queryObject.timestamp = { $gt: query.timestampGreaterThan, $lt: query.timestampLessThan };
    }

    const nfts = await nftDetails.find(queryObject);
    res.status(200).json(nfts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST - QuickMint NFT

/**
 * @swagger
 * /nfts/quickmint:
 *   post:
 *     summary: Create and mint new non-fungible tokens (NFTs) quickly.
 *     tags:
 *       - NFTs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuickMintRequest'
 *     responses:
 *       200:
 *         description: Success. Returns the details of the created and minted NFT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuickMintResponse'
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 */

// Define the request body schema for quick minting
/**
 * @swagger
 * components:
 *   schemas:
 *     QuickMintRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the NFT.
 *         description:
 *           type: string
 *           description: The description of the NFT.
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the image for the NFT.
 *         addressTo:
 *           type: string
 *           description: The address of the recipient of the NFT.
 *       required:
 *         - name
 *         - description
 *         - image
 *         - addressTo
 */

// Define the response schema for quick minting
/**
 * @swagger
 * components:
 *   schemas:
 *     QuickMintResponse:
 *       type: object
 *       properties:
 *         tokenId:
 *           type: string
 *           description: The token ID of the minted NFT.
 *         contractAddress:
 *           type: string
 *           description: The address of the NFT contract.
 *         owner:
 *           type: string
 *           description: The address of the NFT owner.
 *         tokenURI:
 *           type: string
 *           description: The URI of the minted NFT.
 *         txHash:
 *           type: string
 *           description: The hash value of the transaction related to the minted NFT.
 */

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


// Get collection details

/**
 * @swagger
 * /nfts/collectionDetails:
 *   get:
 *     summary: Retrieve information about a deployed NFT collection.
 *     tags:
 *       - NFTs
 *     parameters:
 *       - in: query
 *         name: contractAddress
 *         schema:
 *           type: string
 *         description: The address of the NFT collection contract.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the NFT collection.
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         description: The symbol of the NFT collection.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: The sorting criteria for the collection details (e.g., "name", "-timestamp").
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: The fields to include in the collection details (e.g., "name,symbol,maxSupply").
 *     responses:
 *       200:
 *         description: Success. Returns the details of the deployed NFT collection.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionDetailsResponse'
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 */

// Define the response schema for collection details
/**
 * @swagger
 * components:
 *   schemas:
 *     CollectionDetailsResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: The total number of matching collections.
 *         collections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NFTCollection'
 */

// Define the schema for the NFT collection details
/**
 * @swagger
 * components:
 *   schemas:
 *     NFTCollection:
 *       type: object
 *       properties:
 *         contractAddress:
 *           type: string
 *           description: The address of the NFT collection contract.
 *         name:
 *           type: string
 *           description: The name of the NFT collection.
 *         symbol:
 *           type: string
 *           description: The symbol of the NFT collection.
 *         maxSupply:
 *           type: number
 *           description: The maximum supply of the NFT collection.
 *         txHash:
 *           type: string
 *           description: The hash value of the transaction related to the deployment of the NFT collection.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the NFT collection was deployed.
 */

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


// POST - Deploy Collection

/**
 * @swagger
 * /nfts/deploycollection:
 *   post:
 *     summary: Deploy an NFT collection on the blockchain.
 *     tags:
 *       - NFTs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeployCollectionRequest'
 *     responses:
 *       200:
 *         description: Success. Returns the address of the deployed NFT collection contract.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeployCollectionResponse'
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 */

// Define the request schema for deploying an NFT collection
/**
 * @swagger
 * components:
 *   schemas:
 *     DeployCollectionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the NFT collection.
 *         symbol:
 *           type: string
 *           description: The symbol of the NFT collection.
 *         maxSupply:
 *           type: number
 *           description: The maximum supply of the NFT collection.
 */

// Define the response schema for deploying an NFT collection
/**
 * @swagger
 * components:
 *   schemas:
 *     DeployCollectionResponse:
 *       type: object
 *       properties:
 *         contractAddress:
 *           type: string
 *           description: The address of the deployed NFT collection contract.
 */

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





//POST - Mint From Collection

/**
 * @swagger
 * /nfts/mintFromCollection:
 *   post:
 *     summary: Mint new NFTs from an existing NFT collection.
 *     tags:
 *       - NFTs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MintFromCollectionRequest'
 *     responses:
 *       200:
 *         description: Success. Returns the details of the minted NFTs.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MintFromCollectionResponse'
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 */

// Define the request schema for minting NFTs from a collection
/**
 * @swagger
 * components:
 *   schemas:
 *     MintFromCollectionRequest:
 *       type: object
 *       properties:
 *         contractAddress:
 *           type: string
 *           description: The address of the NFT collection contract.
 *         name:
 *           type: string
 *           description: The name of the NFT.
 *         description:
 *           type: string
 *           description: The description of the NFT.
 *         image:
 *           type: string
 *           description: The image URL of the NFT.
 *         addressTo:
 *           type: string
 *           description: The address to which the minted NFT will be assigned.
 */

// Define the response schema for minting NFTs from a collection
/**
 * @swagger
 * components:
 *   schemas:
 *     MintFromCollectionResponse:
 *       type: object
 *       properties:
 *         tokenId:
 *           type: string
 *           description: The ID of the minted NFT.
 *         contractAddress:
 *           type: string
 *           description: The address of the NFT collection contract.
 *         owner:
 *           type: string
 *           description: The address of the NFT owner.
 *         tokenURI:
 *           type: string
 *           description: The URI of the minted NFT.
 *         txHash:
 *           type: string
 *           description: The transaction hash of the minting transaction.
 */


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

module.exports = router;