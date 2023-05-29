const { ethers } = require("ethers");
const solc = require("solc");
const path = require('path');
const fs = require('fs');
const NFTcollectionDetails = require("../model/NFTcollectionDetails");

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const privateKey = process.env.PRIVATE_KEY;

const signer = new ethers.Wallet(privateKey, provider);


const deployNFTCollection = async (name, symbol, maxSupply) => {
  try {
    const inboxPath = path.resolve(
      __dirname,
      "contracts",
      "NFTcollection.sol"
    );
    const source = fs.readFileSync(inboxPath, "utf8");

    // console.log("source:",source)

    const input = {
      language: "Solidity",
      sources: {
        "NFTcollection.sol": {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    var output = JSON.parse(solc.compile(JSON.stringify(input)));

    // for (var contractName in output.contracts["NFTcollection.sol"]) {

    const contractABI =
      output.contracts["NFTcollection.sol"]["NFTcollection"].abi;
    const bytecode =
      output.contracts["NFTcollection.sol"]["NFTcollection"]["evm"].bytecode;

    // console.log('contractABI', contractABI)
    // console.log('bytecode', bytecode)

    // Deploy the contract
    const factory = new ethers.ContractFactory(contractABI, bytecode, signer);
    const deployedContract = await factory.deploy(name, symbol, maxSupply, {
      gasLimit: ethers.BigNumber.from(6000000),
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
    });

    console.log("deployedContract", deployedContract);

    

    // Wait for the contract deployment transaction to be mined
    await deployedContract.deployed();



    // Return the contract code
    const contractAddress = deployedContract.address;
    console.log("Contract Code:", contractAddress);

// Get the transaction hash
const txHash = deployedContract.deployTransaction.hash;
console.log("Transaction Hash:", txHash);

    // ----------------MongoDB----------------------------//
  // var tokenHash = ethers.utils.id(contractAddress + tokenId);

  const result = await NFTcollectionDetails.updateOne(
    { contractAddress: contractAddress }, // filter to select the document to update
    {
      $set: {
        contractAddress: contractAddress,
        name: name,
        symbol: symbol,
        maxSupply: maxSupply,
        txHash: txHash,
      },
    }, // update operator to update multiple fields
    { upsert: true }
  );
  console.log(result);




    return contractAddress;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { deployNFTCollection };
