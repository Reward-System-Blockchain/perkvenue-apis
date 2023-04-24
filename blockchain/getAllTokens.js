// const { ethers } = require("ethers");
// const {
//   tokenFactoryAddress,
//   tokenFactoryABI,
//   RewardTokenABI,
// } = require("./constants");
const rewardTokenDetails = require("../model/rewardTokenDetails");

// const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
// const privateKey = process.env.PRIVATE_KEY;
// const signer = new ethers.Wallet(privateKey, provider);
// const FactoryContract = new ethers.Contract(
//   tokenFactoryAddress,
//   tokenFactoryABI,
//   signer
// );

const getAllTokens = async () => {
//   const tokenCount = await FactoryContract.getTokenCount();
//   console.log("Token Count:", tokenCount.toNumber());

//   for (let i = 0; i < tokenCount; i++) {
//     const token = await FactoryContract.getToken(i);
//     const RewardTokenContract = new ethers.Contract(
//       token[1],
//       RewardTokenABI,
//       signer
//     );
//     const totalSupply = (await RewardTokenContract.totalSupply()).toString();

//     var tokenHash = ethers.utils.id(token[1] + i);

//     const result = await rewardTokenDetails.updateOne(
//       { tokenHash: tokenHash }, // filter to select the document to update
//       {
//         $set: {
//             tokenId: i,
//             tokenAddress: token[1],
//             creator: token[0],
//             name: token[2],
//             symbol: token[3],
//             totalSupply: totalSupply,
//         },
//       }, // update operator to update multiple fields
//       { upsert: true }
//     );

//   }
  const tokens = await rewardTokenDetails.find();

  console.log("Tokens:", tokens);
  return tokens;
};

module.exports = { getAllTokens };

