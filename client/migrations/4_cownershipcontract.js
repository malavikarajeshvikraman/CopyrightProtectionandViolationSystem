const cownershipcontract = artifacts.require("cownershipcontract");

module.exports = function(deployer) {
  deployer.deploy(cownershipcontract);
};
