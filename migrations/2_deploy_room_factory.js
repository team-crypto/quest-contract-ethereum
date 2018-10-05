const fs = require('fs')
const RoomFactory = artifacts.require('./RoomFactory.sol')

module.exports = deployer => {
    deployer.deploy(RoomFactory)
}
