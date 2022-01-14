// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RWRDToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingApp {
    string public name = "Staking Contract";
    address public owner;
    RWRDToken public rwrdToken;
    event Stake(address indexed from, address to, uint256 value, uint256 stakingSlot, uint256 momentStaked);
    event Unstake(address from, address indexed to, uint256 value, uint256 lockedBalance);
    event Claim(address from, address indexed to, uint256 value);

    struct ethAndTime {
        uint amountEth;
        uint timeStaked;
    } 
    mapping(address => ethAndTime[]) public ethBalances;
    mapping(address => uint) public amountPayable;

    constructor(RWRDToken _rwrdToken) {
        rwrdToken = _rwrdToken;
        owner = msg.sender;
    }

    function TokenBalance() public view{
        rwrdToken.balanceOf(owner);
    }

    function stakeETH(uint _amount) public payable {

        require(msg.value == _amount);
        _amount = msg.value;

        ethBalances[msg.sender].push(ethAndTime(msg.value, block.timestamp));

        uint momentStaked = block.timestamp;

        emit Stake(msg.sender, owner, _amount, ethBalances[msg.sender].length, momentStaked);
    }


    function unstakeETH() public {

        uint currentBalance;

        for(uint i = 0; i < ethBalances[msg.sender].length; i++){
            currentBalance = currentBalance + ethBalances[msg.sender][i].amountEth;
        }

        require(currentBalance > 0, "staking balance cannot be 0");

        uint ethAvaiable;
        uint ethStillStaked;

        for(uint i = 0; i < ethBalances[msg.sender].length; i++){
            if(ethBalances[msg.sender][i].timeStaked > 7 days) {
                ethAvaiable = ethAvaiable + ethBalances[msg.sender][i].amountEth;
                ethBalances[msg.sender][i].amountEth = 0;
            } else {
                ethStillStaked = ethStillStaked + ethBalances[msg.sender][i].amountEth;
            }
        }

        require(ethAvaiable > 0, "no unlocked balance yet");

        payable(owner).transfer(ethAvaiable);

        emit Unstake(owner, msg.sender, ethAvaiable, ethStillStaked);
    }

    function claimTokens() public {

        for(uint i = 0; i < ethBalances[msg.sender].length; i++){
            if((ethBalances[msg.sender][i].amountEth / (1 ether)) * (ethBalances[msg.sender][i].timeStaked / 86400) > 0){
                amountPayable[msg.sender] = amountPayable[msg.sender] + (ethBalances[msg.sender][i].amountEth / (1 ether)) * (ethBalances[msg.sender][i].timeStaked / 86400) * 10;
                ethBalances[msg.sender][i].timeStaked = 0;
            }
        }

        require(amountPayable[msg.sender] > 0, "No Tokens to claim");

        rwrdToken.transfer(msg.sender, amountPayable[msg.sender]);

        emit Claim(owner, msg.sender, amountPayable[msg.sender]);

        amountPayable[msg.sender] = 0;
    }

}
