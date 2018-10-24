pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "./Activatable.sol";

contract Room is Destructible, Pausable, Activatable {

    mapping (uint => bool) public rewardSent;

    event Deposited(
        address indexed _depositor,
        uint _depositedValue
    );

    event RewardSent(
        address indexed _dest,
        uint _reward,
        uint _id
    );

    event RefundedToOwner(
        address indexed _dest,
        uint _refundedBalance
    );

    constructor(address _creator) public payable {
        owner = _creator;
    }

    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Deposited value must be larger than 0");
        emit Deposited(msg.sender, msg.value);
    }

    function sendReward(uint _reward, address _dest, uint _id) external onlyOwner {
        require(!rewardSent[_id], "Reward had been already sent to the selected question");
        require(_reward > 0, "Reward must be larger than 0");
        require(address(this).balance >= _reward, "Contract must have larger balance than amount of reward");
        require(_dest != owner, "Owner cannot send reward to oneself");

        rewardSent[_id] = true;
        _dest.transfer(_reward);
        emit RewardSent(_dest, _reward, _id);
    }

    function refundToOwner() external whenNotActive onlyOwner {
        require(address(this).balance > 0, "Contract balance must be larger than 0");

        uint refundedBalance = address(this).balance;
        owner.transfer(refundedBalance);
        emit RefundedToOwner(msg.sender, refundedBalance);
    }
}
