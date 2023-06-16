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






module.exports = router;
