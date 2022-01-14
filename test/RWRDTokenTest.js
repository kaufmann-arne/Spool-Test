// SPDX-License-Identifier: MIT

const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const RWRDToken = artifacts.require('RWRDToken');

contract('RWRDToken', (accounts) => {

  it('initial supply', async () => {
        rwrdToken = await RWRDToken.deployed();
        let initialSupply = await rwrdToken.totalSupply();
        assert.equal(initialSupply.toNumber(), 10000, "Supply Error");
    });

  it('has a name', async () => {
        rwrdToken = await RWRDToken.deployed();
        let name = await rwrdToken.name();
        assertequal(name.toString(), RWRDToken, "Wrong Name");
    });

  it('has a symbol', async () => {
        rwrdToken = await RWRDToken.deployed();
        let symbol = await rwrdToken.symbol();
        assertequal(symbol.toString(), RWRD, "Wrong Symbol");
    });

  it('should have a balance of zero (tokens transferred to contract)', async () => {
        rwrdToken = await RWRDToken.deployed();
        let balance = await rwrdToken.balanceOf(rwrdToken.address);
        assertequal(balance.toNumber(), 0, "Tokens not transferred");
    });
});
