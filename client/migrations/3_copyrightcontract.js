const copyrightcontract = artifacts.require("copyrightcontract");

module.exports = function(deployer) {
  deployer.deploy(copyrightcontract);
};
