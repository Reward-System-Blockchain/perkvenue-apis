const { NFTStorage ,File} = require("nft.storage");
const axios = require('axios');
const Web3 = require("web3");
const fs = require("fs");
// const fetch = require('node-fetch');
const { Blob } = require('buffer');
const { contractAddress, contractABI } = require("./constants");
const nftDetails = require("../model/nftDetails");

async function uploadToIPFS(nftName, nftDescription, nftImage) {
    try {
      const client = new NFTStorage({
        token: process.env.NFT_STORAGE_API,
      });

    //   const response = await fetch(nftImage);
    //     const blob = await response.blob();
    // fetch image data from URL
    function getImageExtension(url) {
      const parts = url.split('.');
      return parts[parts.length - 1];
    }
    function generateRandomString(length) {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    const response = await axios.get(nftImage, {
      responseType: 'arraybuffer'
    });

  // create File object from image data
    const imageData = response.data;
    const extension = getImageExtension(nftImage);
    const filename = `image.${extension}`;
    const file = new File([imageData], filename, {
      type: "image/jpeg",
    });
  
    // const response = await fetch(nftImage);
    // const buffer = await response.arrayBuffer();
    // const file = new Blob([buffer], { type: "image/jpeg" });
    // const blobUrl = URL.createObjectURL(file);
    // console.log("blobUrl:",blobUrl);
    // console.log("blob:",file);
    
      const metadata = await client.store({
        name: nftName,
        description: nftDescription,
        image: file,
        // image: new File([await fs.promises.readFile("flowers.jpg")], "flowers.jpg", {
        //   type: "image/jpeg",
        // }),
      });
      let nftURI = "https://nftstorage.link/ipfs/" + metadata.url.slice(7);
      console.log("NFTuri:",nftURI);
      return nftURI;
    } catch (error) {
      console.error("IPFS upload failed:", error);
      throw error;
    }
  }
  
const provider = new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com");
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(contractABI, contractAddress);

const mintNFT = async (name, description, imageURL, addressTo) => {
    console.log("Name:",name);
    console.log("description:",description);
    console.log("imageURL:",imageURL);
    console.log("addressTo:",addressTo);
  const ipfsLink = await uploadToIPFS(name, description, imageURL);
  const tokenURI = ipfsLink;

  const nonce = await web3.eth.getTransactionCount(addressTo);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 300000;
  const contractFunction = contract.methods.quickMint(addressTo, tokenURI);
  const functionAbi = contractFunction.encodeABI();
  const tx = {
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to: contractAddress,
    data: functionAbi,
  };

  console.log("tx:",tx);
  // const signedTx = await window.ethereum.request({
  //   method: "eth_sendTransaction",
  //   params: [
  //     {
  //       ...tx,
  //       from: addressTo,
  //       value: "0x0",
  //     },
  //   ],
  // });

  // const txReceipt = await web3.eth.getTransactionReceipt(signedTx);
  // const tokenId = web3.eth.abi.decodeParameter("uint256", txReceipt.logs[0].data);

  // ----------------MongoDB----------------------------//
  // const result = await nftDetails.insertOne({
  //   owner: addressTo,
  //   tokenID: tokenId,
  //   tokenURI: tokenURI,
  //   tokenAddress: contractAddress,
  //   txHash: txHash.transactionHash,
  // });
  // console.log(result);
  // return tokenId;
  return tx;
};

module.exports = { mintNFT };