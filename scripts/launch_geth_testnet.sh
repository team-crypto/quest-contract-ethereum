#!/bin/bash

DIR=$PWD/scripts/geth_private_testnet/
mkdir -p $DIR
cd "${0%/*}"

cp ./genesis.json $DIR
cp -r ./keystore $DIR
mkdir -p $DIR/etc
echo -n blah > $DIR/etc/pw

geth --datadir $DIR --nodiscover --maxpeers 0 init $DIR/genesis.json
# https://github.com/ethereum/go-ethereum/issues/16342
geth --datadir $DIR --networkid 15 --nodiscover --maxpeers 0 --mine --minerthreads 1 --rpc --rpccorsdomain "*" --rpcvhosts "*" --rpcapi "eth,web3,personal,net" --ipcpath "/tmp/geth.ipc" --ws --wsapi "eth,web3,personal,net" --wsorigins "*" --unlock 0,1,2,3,4 --password $DIR/etc/pw console

