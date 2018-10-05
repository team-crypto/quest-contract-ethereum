# quest-contract-ethereum

## Dependencies
- truffle
- node.js
- geth (or Ganache)


### install truffle
You install globally `truffle` with the following :
```
$ npm i -g truffle
```


### install npm modules
You install these modules with the following : 
```
$ npm i
```


### privatenet (geth)
You can not run without geth in the local environment. If geth is not installed, please install it.


First, run `launch_test_net.sh` in the scripts directory from the terminal.

If DAG is not generated, it will take some time for DAG to be generated.

Please open another terminal and execute the following command.


#### truffle console
You can enter truffle console with the following : 
```
$ truffle console
```


### privatenet (Ganache GLI)
Or, you can use Ganache as the local environment.

First, run Ganache CLI from the terminal.
```
$ ganache-cli
```


#### truffle console
You can enter truffle console with the following : 
```
$ truffle console
```


### privatenet (Ganache app)
You can also use Ganache app as the local environment. If Ganache app is not installed, [please install it](https://truffleframework.com/ganache).

First, run Ganache app.

#### truffle console
You can enter truffle console with the following : 
```
$ truffle console --network ganache
```






