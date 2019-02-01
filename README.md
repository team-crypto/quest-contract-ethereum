# quest-contract-ethereum

## Dependencies
- truffle v4.1.14
- node.js
- geth (or Ganache)


### install truffle
You install globally `truffle` version 4.1.14 with the following :
```
$ npm i -g truffle@4.1.14
```

Because of the solidity compiler(solc-js) version 0.4.24, you need to install truffle version 4.1.14.


##### NOTICE
If you have globally installed Truffle version 5, you have to run with `npx` command in order to use version 4.1.14 locally installed.

e.g
```
$ npx truffle compile --all
```

```
$ npx truffle migrate --reset --network ropsten
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


### privatenet (Ganache CLI)
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






