const { ethers } = require("ethers");
const { tokenFactoryAddress, tokenFactoryABI, RewardTokenABI } = require("./constants/constants");
const { mintTokenNotification } = require("./Notifications/PushNotifications");

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const privateKey = process.env.PRIVATE_KEY;

const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signer);

const mintTokens = async (tokenAddress, account, amount) => {
    const transaction = await contract.mintToken(tokenAddress, account, amount);
    const txHash = transaction.hash;
    console.log("transaction Hash:", txHash); // log the transaction hash for debugging purposes
    await transaction.wait();
    await mintTokenNotification(tokenAddress, account, amount);
    return `${amount} tokens successfully minted to account: ${account} for token: ${tokenAddress}`;
};

module.exports = { mintTokens };