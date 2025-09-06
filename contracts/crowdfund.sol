// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Crowdfund {
    address payable public owner;
    uint public goal;
    uint public deadline;
    uint public totalFunds;
    mapping(address => uint) public contributions;
    bool public isGoalReached;
    string public name;

    event ContributionReceived(address contributor, uint amount);
    event FundsWithdrawn(address owner, uint amount);

    function initialize(string calldata _name, uint _goal, uint _duration) external {
        require(owner == address(0), "Already initialized");
        owner = payable(msg.sender);
        name = _name;
        goal = _goal;
        deadline = block.timestamp + _duration;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Crowdfund has ended");
        require(msg.value > 0, "Contribution must be greater than 0");
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
        if (totalFunds >= goal) { isGoalReached = true; }
        emit ContributionReceived(msg.sender, msg.value);
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(block.timestamp >= deadline, "Crowdfund is still active");
        require(totalFunds > 0, "No funds to withdraw");
        uint amount = totalFunds;
        totalFunds = 0;
        owner.transfer(amount);
        emit FundsWithdrawn(owner, amount);
       
        owner = payable(address(0));
        goal = 0;
        deadline = 0;
        isGoalReached = false;
        name = "";
    }

    function refund() external {
        require(block.timestamp >= deadline, "Crowdfund is still active");
        require(!isGoalReached, "Goal was reached, cannot refund");
        uint contributed = contributions[msg.sender];
        require(contributed > 0, "No contributions to refund");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributed);
    }

    function getContribution(address contributor) external view returns (uint) {
        return contributions[contributor];
    }
}