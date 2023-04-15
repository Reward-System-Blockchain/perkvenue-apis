const { NFTStorage } = require("nft.storage");
const Web3 = require("web3");
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

    const response = await fetch(nftImage);
    const buffer = await response.buffer();
    const blob = new Blob([buffer], { type: response.headers.get('content-type') });
  
      const metadata = await client.store({
        name: nftName,
        description: nftDescription,
        image: blob,
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

  // Calculate gas fees
  const gasFees = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasLimit));

  // Get sender's balance
  const senderAddress = process.env.SENDER_ADDRESS;; // Replace with your address
  const senderPrivateKey = process.env.PRIVATE_KEY; // Replace with your private key
  const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
  const senderBalance = await web3.eth.getBalance(senderAddress);

  // Check if sender has enough balance to pay gas fees
  if (gasFees.gt(senderBalance)) {
    throw new Error("Insufficient balance to pay gas fees");
  }

  // Deduct gas fees from sender's balance
  const updatedBalance = web3.utils.toBN(senderBalance).sub(gasFees);

  const signedTx = await senderAccount.signTransaction({
    ...tx,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    value: web3.utils.toHex(updatedBalance),
  });

  const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  const tokenId = await txHash.events.Transfer.returnValues.tokenId;

  // ----------------MongoDB----------------------------//
  const result = await nftDetails.insertOne({
    owner: addressTo,
    tokenID: tokenId,
    tokenURI: tokenURI,
    tokenAddress: contractAddress,
    txHash: txHash.transactionHash,
    timestamp: new Date(),
    _id: new ObjectID(),
  });
  return tokenId;
};

module.exports = { mintNFT };