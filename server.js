const fs = require('fs')
const execSync = require('child_process').execSync
const express = require('express')
const app = express()
const PORT = 3030
const server = app.listen(PORT, () => {
    let result = execSync('truffle migrate --network privatenet')
    console.log(result)
})

app.get("/address", (req, res, next) => {
    fs.readFile('address_room_factory', 'utf8', (err, address) => {
        if (err) {
            console.log(err)
        } else {
            console.log('address: ' + address)
            res.json({address})
        }
    })
})
