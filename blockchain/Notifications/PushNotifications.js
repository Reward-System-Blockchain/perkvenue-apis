// import * as PushAPI from "@pushprotocol/restapi";
const PushAPI = require("@pushprotocol/restapi");

const { ethers } = require("ethers");

const PK = process.env.PUSH_PRIVATE_KEY;
const Pkey = `0x${PK}`;

const _signer = new ethers.Wallet(Pkey);

const createTokenNotification = async (
  tokenAddress,
  tokenId,
  tokenName,
  tokenSymbol,
  creatorAddress,
  txHash
) => {
  //   const { title, message } = props;
  const address = creatorAddress;

  //   const PK = process.env.PUSH_PRIVATE_KEY;
  //   const Pkey = `0x${PK}`;

  //   const _signer = new ethers.Wallet(Pkey);

  const tableBody = `
    Token Address: ${tokenAddress}
    Token ID: ${tokenId}
    Token Name: ${tokenName}
    Token Symbol: ${tokenSymbol}
    Creator Address: ${creatorAddress}
    Transaction Hash: ${txHash}
  `;

  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: _signer,
    type: 3, // target
    identityType: 0, // minimal payload
    notification: {
      title: "Token has been created Successfully!",
      body: tableBody,
    },
    payload: {
      title: "Token has been created Successfully!",
      body: tableBody,
      cta: "",
      img: "",
    },
    recipients: address, // recipients addresses
    channel: "eip155:80001:0xD490fB9eee2578444CFa56D74B4afaf215EfC269", // your channel address
    env: "staging",
  });
  console.log(apiResponse);
};

const mintNFTNotification = async (
  tokenId,
  contractAddress,
  addressTo,
  tokenURI,
  txHash
) => {
  //   const { title, message } = props;
  const address = addressTo;

  const tableBody = `
      Contract Address: ${contractAddress}
      Token ID: ${tokenId}
      NFT Metadata: ${tokenURI}
      Owner: ${addressTo}
      Transaction Hash: ${txHash}
    `;

  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: _signer,
    type: 3, // target
    identityType: 0, // minimal payload
    notification: {
      title: "NFT has been minted Successfully!",
      body: tableBody,
    },
    payload: {
      title: "NFT has been minted Successfully!",
      body: tableBody,
      cta: "",
      img: "",
    },
    recipients: address, // recipients addresses
    channel: "eip155:80001:0xD490fB9eee2578444CFa56D74B4afaf215EfC269", // your channel address
    env: "staging",
  });
  console.log(apiResponse);
};

const mintTokenNotification = async (tokenAddress, account, amount) => {
    //   const { title, message } = props;
    const address = account;
  
    
    const tableBody = `${amount} tokens successfully minted to your account. 
    Token Address: ${tokenAddress}
    Account Address: ${account}`;
  
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 3, // target
      identityType: 0, // minimal payload
      notification: {
        title: "Tokens has been minted Successfully!",
        body: tableBody
      },
      payload: {
          title: "Tokens has been minted Successfully!",
          body: tableBody,
        cta: "",
        img: "",
      },
      recipients: address, // recipients addresses
      channel: "eip155:80001:0xD490fB9eee2578444CFa56D74B4afaf215EfC269", // your channel address
      env: "staging",
    });
    console.log(apiResponse);
  };

  const burnTokenNotification = async (tokenAddress, account, amount) => {
    //   const { title, message } = props;
    const address = account;
  
    
    const tableBody = `${amount} tokens has been deducted from your account. 
    Token Address: ${tokenAddress}
    Account Address: ${account}`;
  
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 3, // target
      identityType: 0, // minimal payload
      notification: {
        title: "Tokens Deducted Successfully!",
        body: tableBody
      },
      payload: {
          title: "Tokens Deducted Successfully!",
          body: tableBody,
        cta: "",
        img: "",
      },
      recipients: address, // recipients addresses
      channel: "eip155:80001:0xD490fB9eee2578444CFa56D74B4afaf215EfC269", // your channel address
      env: "staging",
    });
    console.log(apiResponse);
  };

module.exports = { createTokenNotification, mintNFTNotification, mintTokenNotification, burnTokenNotification };
