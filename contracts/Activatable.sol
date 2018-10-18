pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Activatable
 * @dev Base contract which allows children to implement an ordinary stop mechanism,
 * especially when you want to change room's status.
 */
contract Activatable is Ownable {
    event Deactivate(address indexed _sender);
    event Activate(address indexed _sender);

    bool public active = false;

    /**
     * @dev Modifier to make a function callable only when the contract is active.
     */
    modifier whenActive() {
        require(active, "Room status must be active to call this function");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not active.
     */
    modifier whenNotActive() {
        require(!active, "Room status must be inactive to call this function");
        _;
    }

    /**
     * @dev called by the owner to deactivate, triggers stopped state.
     */
    function deactivate() public whenActive onlyOwner {
        active = false;
        emit Deactivate(msg.sender);
    }

    /**
     * @dev called by the owner to activate, returns to normal state.
     */
    function activate() public whenNotActive onlyOwner {
        active = true;
        emit Activate(msg.sender);
    }

}
