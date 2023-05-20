const rewardTokenDetails = require("../model/rewardTokenDetails");

const getAllTokens = async () => {
  const tokens = await rewardTokenDetails.find();

  console.log("Tokens:", tokens);
  return tokens;
};

module.exports = { getAllTokens };

