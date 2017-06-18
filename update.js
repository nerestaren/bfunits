#!/bin/node

const fs = require('fs');
const path = require('path');
const {spawn, spawnSync} = require('child_process');
const request = require('request');

fs.readFile(path.join('bravefrontier_data', 'last_update.txt'), 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        data = data.replace('\r\n', '\n');
        request('https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/last_update.txt', (error, response, body) => {
            if (error) {
                console.error(error);
            } else {
                if (data === body) {
                    //console.log(new Date().toISOString() + '\t' + 'No changes.\n');
                } else {
                    performUpdate();
                }
            }
        });
    }
});

function performUpdate() {
    process.chdir('bravefrontier_data');

    const checkout = spawn('git', ['checkout', 'HEAD', 'last_update.txt', 'info.json', 'items.json', 'ai.json', 'bbs.json', 'es.json', 'evo_list.json', 'feskills.json', 'ls.json']);

    checkout.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    checkout.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    checkout.on('exit', (code) => {
        if (code === 0) {
            console.log(new Date().toISOString() + '\t' + 'Updated.\n')
        } else {
            console.error(new Date().toISOString() + '\t' + 'Error updating.\n');
        }
    });
}

/*process.chdir('bravefrontier_data');

 const checkout = spawn('git', ['checkout', 'HEAD', 'last_update.txt']);

 checkout.on('exit', (code) => {
 console.log('checkout amb èxit', code);

 fs.readFile('last_update.txt', (err, data) => {
 if (err) {
 console.error(err);
 } else {
 console.log(data);
 }
 });
 });*/