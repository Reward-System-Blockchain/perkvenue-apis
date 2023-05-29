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

async function getUserBalance(tokenAddress, userAddress) {
    
    // Create a new instance of the RewardToken contract using the ABI and token address
    const rewardTokenContract = new ethers.Contract(tokenAddress, RewardTokenABI, provider);

    // Get token balance for the user
    const balance = await rewardTokenContract.balanceOf(userAddress);
    
    console.log(balance.toString());
    return balance.toString();
};

module.exports = { getUserBalance };
// getTokenDetails("0x113E638838a5862Fb04d3f35B2617D6C10E1F043");

