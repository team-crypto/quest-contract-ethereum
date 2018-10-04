module.exports = {
    accounts: 35,
    port: 8555,
    norpc: false,
    testCommand: 'truffle test',
    testrpcOptions: '--port 8555',
    copyPackages: ['openzeppelin-solidity'],
    skipFiles: ['Migrations.sol', 'Activatable.sol'],
    deepSkip: false,
    dir: '.',
    buildDirPath: '/build/contracts'
};
