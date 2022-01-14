
const RWRDToken = artifacts.require('RWRDToken');
const StakingApp = artifacts.require('StakingApp');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const helper = require('./helpers/truffleTestHelpers');
contract("StakingApp", async accounts => {
    it("has (correct) Token Balance", async () => {
        stakingApp = await StakingApp.deployed();
        rwrdToken = await RWRDToken.deployed();
        let balance = stakingApp.TokenBalance();
        assert.equal(balance, 10000, "No RWRD Token in contract")
    });

    it("correct Staking Balance", async () => {
        stakingApp = await StakingApp.deployed();
        stakingBalanceSend = await StakingApp.stakeETH(1000000000000000000); //1ETH
        let stakingBalanceReceived = ethBalances[msg.sender][0].amountEth;

        truffleAssert.eventEmitted(
            stakingBalanceSend,
            "Stake",
            (ev) => {
                assert.equal(ev.value, stakingBalanceReceived, "Stake amount differs from amount send");
                assert.equal(ev.value, stakingBalanceSend, "Stake amount in event differs from amount received");
                return true;
            },
            "Stake event should have triggered");
    });

    it("correct Staking Time", async () => {
        stakingApp = await StakingApp.deployed();
        stakingBalanceSend = await StakingApp.stakeETH(1000000000000000000); //1ETH
        await helper.advanceTimeAndBlock(86400*3); //Move Blockchain 3 days
        timeStaked = ethBalances[msg.sender][0].amountTime;

        truffleAssert.eventEmitted(
            stakingBalanceSend,
            "Stake",
            (ev) => {
                assert.equal(ev.momentStaked + 86400*3, timeStaked, "Stakingtime differs from time emitted by event");
                return true;
            },
            "Stake event should have triggered");
    });

    it("correct Unstaking Balance/Amount", async () => {
        stakingApp = await StakingApp.deployed();
        await StakingApp.stakeETH(1000000000000000000); //1ETH
        await helper.advanceTimeAndBlock(86400*3);
        await StakingApp.stakeETH(2000000000000000000);
        await helper.advanceTimeAndBlock(86400*5); 
        unstaking = await StakingApp.unstakeETH();

        truffleAssert.eventEmitted(
            unstaking,
            "Unstake",
            (ev) => {
                assert.equal(ev.value, 1000000000000000000, "Eth available differs from Eth staked");
                assert.equal(ev.lockedBalance, 2000000000000000000, "Eth remaining differs from Eth staked");
                return true;
            },
            "Unstake event should have triggered");
    });

    it("correct Claim Amount", async () => {
        stakingApp = await StakingApp.deployed();
        await StakingApp.stakeETH(1000000000000000000); //1ETH
        await helper.advanceTimeAndBlock(86400*3);
        await StakingApp.stakeETH(2000000000000000000);
        await helper.advanceTimeAndBlock(86400*5);
        claiming = await StakingApp.claimTokens();
        let amountClaimable = (1 * 8 + 2 * 5) * 10;

        truffleAssert.eventEmitted(
            claiming,
            "Claim",
            (ev) => {
                assert.equal(ev.value, amountClaimable, "Amount claimd tokens no correct");
                return true;
            },
            "Stake event should have triggered");
    }); 
});      