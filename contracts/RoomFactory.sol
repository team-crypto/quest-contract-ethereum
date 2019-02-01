pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "./Room.sol";

/**
 * @title RoomFactory
 * @dev The RoomFactory contract can create rooms with `createRoom` payable function
 * which deposits the created room contract.
 */
contract RoomFactory is Destructible, Pausable {

    event RoomCreated(
        address indexed _creator,
        address _room,
        uint256 _depositedValue
    );

    /**
     * @dev Create a room with which the initial deposit you could pay.
     */
    function createRoom() external payable whenNotPaused {
        address newRoom = (new Room).value(msg.value)(msg.sender);
        emit RoomCreated(msg.sender, newRoom, msg.value);
    }

    /**
     * @dev Transfers the current balance to the owner and terminates the contract.
     * override
     */
    function destroy() public onlyOwner whenPaused {
        selfdestruct(owner);
    }

    /**
     * @dev Transfers the current balance to the selected address and terminates the contract.
     * override
     */
    function destroyAndSend(address _recipient) public onlyOwner whenPaused {
        selfdestruct(_recipient);
    }
}
