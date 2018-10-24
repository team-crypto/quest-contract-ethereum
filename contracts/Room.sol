pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "./Activatable.sol";

/**
 * @title Room
 * @dev The Room contract can be deposited in escrow.
 *  The room owner can send the reward to selected questions
 *  on the Q&A style application.
 */
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

    /**
     * @dev Deposit Eth for the prize to the Room contract.
     */
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Deposited value must be larger than 0");
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @dev Transfer _reward to _dest when _dest's question is selected.
     * @param _reward reward selected questioner can get
     * @param _dest questioner's address
     * @param _id ID of question, selected by owner
     */
    function sendReward(uint _reward, address _dest, uint _id) external onlyOwner {
        require(!rewardSent[_id], "Reward had been already sent to the selected question");
        require(_reward > 0, "Reward must be larger than 0");
        require(address(this).balance >= _reward, "Contract must have larger balance than amount of reward");
        require(_dest != owner, "Owner cannot send reward to oneself");

        rewardSent[_id] = true;
        _dest.transfer(_reward);
        emit RewardSent(_dest, _reward, _id);
    }

    /**
     * @dev Refund the rest of deposit to owner. When and only when this room is deactivated,
     * all deposit is refunded to owner.
     */
    function refundToOwner() external whenNotActive onlyOwner {
        require(address(this).balance > 0, "Contract balance must be larger than 0");

        uint refundedBalance = address(this).balance;
        owner.transfer(refundedBalance);
        emit RefundedToOwner(msg.sender, refundedBalance);
    }
}
