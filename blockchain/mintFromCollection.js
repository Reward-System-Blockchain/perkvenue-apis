const { NFTStorage, File } = require("nft.storage");
const axios = require("axios");
const { ethers } = require("ethers");
const { NFTCollectionABI } = require("./constants/constants");
const nftDetails = require("../model/nftDetails");
const { mintFromCollectionNotification } = require("./Notifications/PushNotifications");

async function uploadToIPFS(nftName, nftDescription, nftImage) {
  try {
    const client = new NFTStorage({
      token: process.env.NFT_STORAGE_API,
    });

    function getImageExtension(url) {
      const parts = url.split(".");
      return parts[parts.length - 1];
    }

    const response = await axios.get(nftImage, {
      responseType: "arraybuffer",
    });

    // create File object from image data
    const imageData = response.data;
    const extension = getImageExtension(nftImage);
    const filename = `image.${extension}`;
    const file = new File([imageData], filename, {
      type: "image/jpeg",
    });

    const metadata = await client.store({
      name: nftName,
      description: nftDescription,
      image: file,
    });
    let nftURI = "https://nftstorage.link/ipfs/" + metadata.url.slice(7);
    console.log("NFTuri:", nftURI);
    return nftURI;
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw error;
  }
}

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL
  );
const privateKey = process.env.PRIVATE_KEY;

const signer = new ethers.Wallet(privateKey, provider);


const mintFromCollection = async (contractAddress, name, description, imageURL, addressTo) => {
  console.log("Name:", name);
  console.log("description:", description);
  console.log("imageURL:", imageURL);
  console.log("addressTo:", addressTo);

  const ipfsLink = await uploadToIPFS(name, description, imageURL);
  const tokenURI = ipfsLink;

  const contract = new ethers.Contract(contractAddress, NFTCollectionABI, signer);

  const transaction = await contract.mint(addressTo, tokenURI);
  const txHash = transaction.hash;

  console.log("transaction Hash:", txHash); // log the transaction hash for debugging purposes

  const receipt = await transaction.wait();
  const events = receipt.events.filter((event) => event.event === "Transfer");
  const tokenId = await events[0].args.tokenId.toNumber();
  console.log("token ID:", tokenId);

  console.log("transaction mined");

  // -----------------Push Notification---------------------------//

  await mintFromCollectionNotification(tokenId,contractAddress,addressTo,tokenURI,txHash);

  // ----------------MongoDB----------------------------//
  var tokenHash = ethers.utils.id(contractAddress + tokenId);

  const result = await nftDetails.updateOne(
    { tokenHash: tokenHash }, // filter to select the document to update
    {
      $set: {
        tokenHash: tokenHash,
        owner: addressTo,
        tokenID: tokenId,
        tokenURI: tokenURI,
        tokenAddress: contractAddress,
        txHash: txHash,
      },
    }, // update operator to update multiple fields
    { upsert: true }
  );
  console.log(result);

  // return tokenId;
  return {
    tokenId: tokenId,
    contractAddress: contractAddress,
    owner: addressTo,
    tokenURI: tokenURI,
    txHash: txHash,
  };
};

module.exports = { mintFromCollection };
