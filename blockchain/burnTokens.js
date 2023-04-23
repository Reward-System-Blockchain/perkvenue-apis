const { ethers } = require("ethers");
const { tokenFactoryAddress, tokenFactoryABI, RewardTokenABI}= require("./constants");

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const privateKey = process.env.PRIVATE_KEY;

const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signer);

const burnTokens = async (tokenAddress, account, amount) => {
    const rewardToken = new ethers.Contract(tokenAddress, RewardTokenABI, signer);
    const balance = await rewardToken.balanceOf(account);
    console.log("balance:", balance.toString());

    if (balance.lt(amount)) {
        // throw new Error(`Insufficient balance: account ${account} has ${balance.toString()} tokens`);
        return `Insufficient balance: account ${account} has ${balance.toString()} tokens`;
    }

    const transaction = await contract.burnToken(tokenAddress, account, amount);
    const txHash = transaction.hash;
    console.log("transaction Hash:", txHash); // log the transaction hash for debugging purposes
    await transaction.wait();
    return `${amount} tokens successfully burnt from account: ${account} for token: ${tokenAddress}`;
};

module.exports = { burnTokens };