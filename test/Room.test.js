const EVMRevert = require('openzeppelin-solidity/test/helpers/EVMRevert')
const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent')

const BigNumber = web3.BigNumber
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

const RoomFactory = artifacts.require('./RoomFactory.sol')
const Room = artifacts.require('./Room.sol')

contract('Room', ([factoryOwner, roomOwner, ...accounts]) => {

    describe('as an instance', function () {

        beforeEach(async function () {
            this.roomFactory = await RoomFactory.new({ from: factoryOwner })

            //room作成時にあらかじめ1ethをデポジットしている
            const { logs } = await this.roomFactory.createRoom({ from: roomOwner, value: web3.toWei('1', 'ether') })
            const event = await expectEvent.inLogs(logs, 'RoomCreated')
            this.room = await Room.at(event.args._room)
        })

        it('should exist', function () {
            this.room.should.exist
        })

        describe('constructor', function () {
            it('caller should be the room owner', async function () {
                (await this.room.owner()).should.equal(roomOwner)
            })
        })

        describe('deposit', function () {
            const amount = web3.toWei('.5', 'ether')

            it('not noly room owner can deposit', async function () {
                const initialBalance = await web3.eth.getBalance(this.room.address)
                await this.room.deposit({ from: roomOwner, value: amount })
                const finalBalance = await web3.eth.getBalance(this.room.address)
                finalBalance.sub(initialBalance).should.be.bignumber.equal(amount)
            })

            it('can also deposit from any accounts', async function () {
                const initialBalance = await web3.eth.getBalance(this.room.address)
                await this.room.deposit({ from: accounts[0], value: amount })
                const finalBalance = await web3.eth.getBalance(this.room.address)
                finalBalance.sub(initialBalance).should.be.bignumber.equal(amount)
            })

            it('not noly room owner cannot accept an empty deposit', async function () {
                await this.room.deposit({ from: roomOwner, value: 0 })
                    .should.be.rejectedWith(EVMRevert)
            })

            it('cannot also accept an empty deposit from any accounts', async function () {
                await this.room.deposit({ from: accounts[0], value: 0 })
                    .should.be.rejectedWith(EVMRevert)
            })

            it('should emit a Deposited event', async function () {
                const { logs } = await this.room.deposit({ from: accounts[0], value: amount })

                const event = await expectEvent.inLogs(logs, 'Deposited')
                event.args._depositor.should.equal(accounts[0])
                event.args._depositedValue.should.be.bignumber.equal(amount)
            })

            it('can pause deposit', async function () {
                await this.room.pause({ from: roomOwner })
                await this.room.deposit({ from: accounts[0], value: amount })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.deposit({ from: roomOwner, value: amount })
                    .should.be.rejectedWith(EVMRevert)
            })

            it('only the room owner can pause deposit', async function () {
                await this.room.pause({ from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.pause({ from: roomOwner })
                    .should.be.fulfilled
            })

            it('only the room owner can unpause deposit', async function () {
                await this.room.pause({ from: roomOwner })
                await this.room.unpause({ from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.unpause({ from: roomOwner })
                    .should.be.fulfilled
                await this.room.deposit({ from: accounts[0], value: amount })
                    .should.be.fulfilled
            })
        })

        describe('sendReward', function () {
            it('can send small Units', async function () {
                const kweiAmount = web3.toWei('2', 'kwei')
                const mweiAmount = web3.toWei('3', 'mwei')
                const gweiAmount = web3.toWei('1.5', 'gwei')
                const szaboAmount = web3.toWei('1.0', 'szabo')
                const finneyAmount = web3.toWei('2', 'finney')

// ルームへのデポジット額が大きくなりうるのであれば検証必要
//                const etherAmount = web3.toWei('3', 'ether')
//                const ketherAmount = web3.toWei('3', 'kether')
//                const grandAmount = web3.toWei('1.5', 'grand')
//                const metherAmount = web3.toWei('1.5', 'mether')
//                const getherAmount = web3.toWei('1.0', 'gether')
//                const tetherAmount = web3.toWei('2', 'tether')

                await this.room.sendReward(kweiAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
                await this.room.sendReward(mweiAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
                await this.room.sendReward(gweiAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
                await this.room.sendReward(szaboAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
                await this.room.sendReward(finneyAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled

// ルームへのデポジット額が大きくなりうるのであれば検証必要
//                await this.room.sendReward(etherAmount, accounts[1], { from: roomOwner })
//                    .should.be.fulfilled
//                await this.room.sendReward(ketherAmount, accounts[1], { from: roomOwner })
//                    .should.be.fulfilled
//                await this.room.sendReward(grandAmount, accounts[1], { from: roomOwner })
//                    .should.be.fulfilled
//                await this.room.sendReward(metherAmount, accounts[1], { from: roomOwner })
//                    .should.be.fulfilled
//                await this.room.sendReward(getherAmount, accounts[1], { from: roomOwner })
//                    .should.be.fulfilled
//                await this.room.sendReward(tetherAmount, accounts[1], { from: roomOwner })
//                    .should.be.fulfilled
            })

            it('cannot send the reward from any accounts except the room owner', async function () {
                const amount = web3.toWei('.5', 'ether')

                await this.room.sendReward(amount, roomOwner, { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, roomOwner, { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
            })

            it('cannot transfer zero amount as the reward', async function () {
                const smallAmount = web3.toWei('0.0001', 'ether')

                await this.room.sendReward(smallAmount, roomOwner, { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(smallAmount, roomOwner, { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(smallAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled

                await this.room.sendReward(0, accounts[1], { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(0, accounts[1], { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(0, roomOwner, { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(0, roomOwner, { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)


                await this.room.sendReward(smallAmount, accounts[1], { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(smallAmount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
            })

            it('cannot send the reward if the amount is more than the room balance', async function () {
                const amount = web3.toWei('1.1', 'ether')

                await this.room.sendReward(amount, roomOwner, { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, roomOwner, { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)

                await this.room.sendReward(amount, accounts[1], { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, accounts[1], { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
            })

            it('can send the reward equivalent to the room balance only from the room owner', async function () {
                const amount = web3.toWei('1', 'ether')

                await this.room.sendReward(amount, roomOwner, { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, roomOwner, { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled

                await this.room.sendReward(amount, accounts[1], { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
            })

            it('the only owner can send reward if the amount is less than or equal to the room balance, but zero amount is not acceptable', async function () {
                const amount = web3.toWei('.5', 'ether')

                await this.room.sendReward(amount, roomOwner, { from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, roomOwner, { from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.sendReward(amount, accounts[1], { from: roomOwner })
                    .should.be.fulfilled
            })

            it('should emit a RewardSent event', async function () {
                const amount = web3.toWei('.5', 'ether')
                const { logs } = await this.room.sendReward(amount, accounts[1], { from: roomOwner })

                const event = await expectEvent.inLogs(logs, 'RewardSent')
                event.args._reward.should.be.bignumber.equal(amount)
                event.args._dest.should.equal(accounts[1])
            })
        })

        describe('refundToOwner', function () {
            it('only the room owner can deactivate the room', async function () {
                await this.room.activate({ from: roomOwner })
                await this.room.deactivate({ from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.deactivate({ from: roomOwner })
                    .should.be.fulfilled
            })

            it('only the room owner can activate the room', async function () {
                //初めからdeactivateされてることを保証
                await this.room.deactivate({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.activate({ from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.activate({ from: roomOwner })
                    .should.be.fulfilled
            })

            it('only the room owner can refund when the room is not active', async function () {
                //初めからdeactivateされてることを保証
                await this.room.deactivate({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.refundToOwner({ from: accounts[0] })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.fulfilled
            })

            it('can refund if the room balance is larger than zero', async function () {
                const amount = web3.toWei('1', 'ether')

                await this.room.sendReward(amount, accounts[1], { from: roomOwner })
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                await this.room.deposit({ from: accounts[0], value: amount })
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.fulfilled
            })

            it('cannot make a double refund in a row because the room balance is larger than zero', async function () {
                const amount = web3.toWei('1', 'ether')

                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.fulfilled
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)

                await this.room.deposit({ from: accounts[0], value: amount })
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.fulfilled
                await this.room.deposit({ from: accounts[0], value: amount })
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.fulfilled
            })

            it('should emit a RefundedToOwner event', async function () {
                const balance = await web3.eth.getBalance(this.room.address)
                await this.room.deactivate({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
                const { logs } = await this.room.refundToOwner({ from: roomOwner })
                const event = await expectEvent.inLogs(logs, 'RefundedToOwner')
                event.args._refundedBalance.should.be.bignumber.equal(balance)
            })

            it('cannot refund to owner when activated', async function () {
                const amount = web3.toWei('1', 'ether')

                //前提としてactive化させている
                await this.room.activate({ from: roomOwner })

                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)

                await this.room.sendReward(amount, accounts[1], { from: roomOwner })
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)

                await this.room.deposit({ from: accounts[0], value: amount })
                await this.room.refundToOwner({ from: roomOwner })
                    .should.be.rejectedWith(EVMRevert)
            })
        })
    })
})
