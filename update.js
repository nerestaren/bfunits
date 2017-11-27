#!/bin/node

const fs = require('fs');
const path = require('path');
const request = require('request');
const { spawnSync } = require('child_process');


fs.access('.updating', (err) => {
    if (err) {
        fs.readFile(path.join('bravefrontier_data', 'last_update.txt'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                request('https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/last_update.txt', (error, response, body) => {
                    if (error) {
                        console.error(error);
                    } else {
                        if (data === body) {
                            // No changes
                        } else {
                            performUpdate();
                        }
                    }
                });
            }
        });
    } else {
        console.error(new Date().toISOString() + '\t' + 'Already updating.\n');
    }
});

function performUpdate() {

    fs.writeFileSync('.updating');

    const files = ['last_update.txt', 'info.json', 'items.json', 'ai.json', 'bbs.json', 'es.json', 'evo_list.json', 'feskills.json', 'ls.json'];
    let promises = [];

    files.forEach(f => {
        promises.push(new Promise((resolve, reject) => {
            request('https://raw.githubusercontent.com/Deathmax/bravefrontier_data/master/' + f)
                .pipe(fs.createWriteStream(path.join('bravefrontier_data', f)))
                .on('error', error => {
                    reject(error);
                })
                .on('finish', () => {
                    resolve();
                });
        }));
    });

    Promise.all(promises).then(() => {
        fs.unlinkSync('.updating');
        console.log(new Date().toISOString() + '\t' + 'Updated.\n');
        processData();
    }).catch(error => {
        fs.unlinkSync('.updating');
        console.error(new Date().toISOString() + '\t' + 'Error updating: ' + error + '\n');
    });
}

function processData() {
    let scripts = fs.readdirSync('scripts');
    scripts.forEach(file => {
        console.log(file);
        require('./' + path.join('scripts', file)).run();
    });
    fs.writeFileSync(path.join('bravefrontier_data_processed', 'last_update.txt'), fs.readFileSync(path.join('bravefrontier_data', 'last_update.txt')));
    process.chdir('bravefrontier_data_processed');
    spawnSync('git', ['add', '.']);
    spawnSync('git', ['commit', '-m', new Date().toISOString()]);
    spawnSync('git', ['push']);
    process.chdir('..');
}