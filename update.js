#!/bin/node

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

process.chdir('bravefrontier_data');

/*const checkout = spawn('git', ['checkout', 'HEAD', 'last_update.txt']);

checkout.on('exit', (code) => {
    console.log('checkout amb èxit');

    fs.readFile('last_update.txt', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
        }
    });
});*/

/*const dir = spawn('dir');

dir.stdout.on('data', (data) => {
    console.log(data);
});

dir.on('exit', (code) => {
    console.log(code);
});*/