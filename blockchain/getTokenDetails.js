const { ethers } = require("ethers");
const {
  tokenFactoryAddress,
  tokenFactoryABI,
  RewardTokenABI,
} = require("./constants/constants");
// const rewardTokenDetails = require("../model/rewardTokenDetails");

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);
const FactoryContract = new ethers.Contract(
  tokenFactoryAddress,
  tokenFactoryABI,
  signer
);

async function getTokenDetails(tokenAddress) {
    
    // Get the token details from the TokenFactory contract
    const tokenDetails = await FactoryContract.tokenDetails(tokenAddress);
    
    // Create a new instance of the RewardToken contract using the ABI and token address
    const rewardTokenContract = new ethers.Contract(tokenAddress, RewardTokenABI, provider);
    
    // Get the total supply of the token
    const totalSupply = await rewardTokenContract.totalSupply();
    
    // Combine the token details and total supply into a single object
    const result = {
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      creator: tokenDetails.creator,
      totalSupply: totalSupply.toString()
    };
    console.log(result);
    return result;
};

module.exports = { getTokenDetails };
// getTokenDetails("0x113E638838a5862Fb04d3f35B2617D6C10E1F043");

