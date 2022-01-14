const RWRDToken = artifacts.require('RWRDToken');
const StakingApp = artifacts.require('StakingApp');

module.exports = async function(deployer) {

  await deployer.deploy(RWRDToken, 'RWRDToken', 'RWRD', '10000000000000000000000');
  const rwrdToken = await RWRDToken.deployed()

  await deployer.deploy(StakingApp, rwrdToken.address)
  const stakingApp = await StakingApp.deployed()

  await rwrdToken.transfer(stakingApp.address, '10000000000000000000000')
}
