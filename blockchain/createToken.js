const { ethers } = require("ethers");
const { tokenFactoryAddress, tokenFactoryABI, RewardTokenABI } = require("./constants");
const rewardTokenDetails = require("../model/rewardTokenDetails");
const { createTokenNotification } = require("./Notifications/PushNotifications");

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const privateKey = process.env.PRIVATE_KEY;

const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signer);

const createToken = async (creatorAddress, name, symbol) => {
  console.log("Name:", name);
  console.log("Symbol:", symbol);

  const transaction = await contract.createToken(creatorAddress, name, symbol);
  const txHash = transaction.hash;
  console.log("transaction Hash:", txHash); // log the transaction hash for debugging purposes

  await transaction.wait();
  // Get the token count from the TokenFactory contract
  const tokenCount = await contract.getTokenCount();

  // Get the token ID of the newly created token
  const tokenId = tokenCount.toNumber() - 1;

  // Get the token address of the newly created token
  const tokenDetails = await contract.tokens(tokenId);
//   const RewardTokenContract = new ethers.Contract(tokenDetails[1], RewardTokenABI, signer);
  // totalSupply= (await RewardTokenContract.totalSupply()).toString(),

  // ------------ PUSH NOTIFICATION ------------ //

  await createTokenNotification(tokenDetails[1],tokenId,name,symbol,creatorAddress,txHash);

  // ------------ MONGODB ------------

  var tokenHash = ethers.utils.id(tokenDetails[1] + tokenId);

    const result = await rewardTokenDetails.updateOne(
      { tokenHash: tokenHash }, // filter to select the document to update
      {
        $set: {
            tokenId: tokenId,
            tokenAddress: tokenDetails[1],
            creator: creatorAddress,
            name: name,
            symbol: symbol,
            transactionHash: txHash,
        },
      }, // update operator to update multiple fields
      { upsert: true }
    );


  return {
    tokenId: tokenId,
    tokenAddress: tokenDetails[1],
    name: name,
    symbol: symbol,
    creatorAddress: creatorAddress,
    transactionHash: txHash,
  };
};

module.exports = { createToken };

// const { ethers } = require("ethers");
// const { tokenFactoryAddress, tokenFactoryABI, RewardTokenABI } = require("./constants");
// const rewardTokenDetails = require("../model/rewardTokenDetails");

// const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
// const privateKey = process.env.PRIVATE_KEY;

// const signer = new ethers.Wallet(privateKey, provider);
// const contract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signer);

// const createToken = async (creatorAddress, name, symbol) => {
//   console.log("Name:", name);
//   console.log("Symbol:", symbol);

//   const transaction = await contract.createToken(creatorAddress, name, symbol);
//   const txHash = transaction.hash;
//   console.log("transaction Hash:", txHash); // log the transaction hash for debugging purposes

//   await transaction.wait();

//   // Get the newly created token address
//   const filter = contract.filters.TokenCreated();
//   const eventLogs = await contract.queryFilter(filter);
//   const tokenAddress = eventLogs[eventLogs.length - 1].args.tokenAddress;

//   // Get the token details using the token address
//   const rewardTokenContract = new ethers.Contract(tokenAddress, RewardTokenABI, signer);
//   const namePromise = rewardTokenContract.name();
//   const symbolPromise = rewardTokenContract.symbol();
//   const totalSupplyPromise = rewardTokenContract.totalSupply();
//   const [nameResult, symbolResult, totalSupplyResult] = await Promise.all([namePromise, symbolPromise, totalSupplyPromise]);

//   // Calculate the token ID from the token address
//   const tokenId = parseInt(tokenAddress.substring(2, 18), 16);

//   // ------------ MONGODB ------------

//   const tokenHash = ethers.utils.id(tokenAddress + tokenId);

//   const result = await rewardTokenDetails.updateOne(
//     { tokenHash: tokenHash }, // filter to select the document to update
//     {
//       $set: {
//         tokenId: tokenId,
//         tokenAddress: tokenAddress,
//         creator: creatorAddress,
//         name: nameResult,
//         symbol: symbolResult,
//         transactionHash: txHash,
//       },
//     }, // update operator to update multiple fields
//     { upsert: true }
//   );

//   return {
//     tokenId: tokenId,
//     tokenAddress: tokenAddress,
//     name: nameResult,
//     symbol: symbolResult,
//     creatorAddress: creatorAddress,
//     totalSupply: totalSupplyResult.toString(),
//     transactionHash: txHash,
//   };
// };

// module.exports = { createToken };
