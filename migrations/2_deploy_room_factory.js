const fs = require('fs')
const RoomFactory = artifacts.require('./RoomFactory.sol')

module.exports = deployer => {
    deployer.deploy(RoomFactory).then(instance => {
        console.log('new contract address: ' + instance.address)
        fs.writeFile('address_room_factory', instance.address, err => {
            if (err) {
                console.log('エラーが発生しました: ' + err)
            } else {
                console.log('good!')
            }
        })
    })
}
