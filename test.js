const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const jimp = require('jimp');
const tracking = require('tracking');

const GROUP_SIZE = 100;
const IMAGE_SIZE = 108;

function schedule(order, group) {
    console.log('schedule', group);
    let promises = [];

    let keys = Object.keys(order).filter(i => {
        return i >= group * GROUP_SIZE && i < (group + 1) * GROUP_SIZE;
    });

    keys.forEach(order_id => {

        let rem = order_id % 100;
        let pos = {
            x: rem % 10,
            y: Math.floor(rem / 10)
        };

        promises.push(jimp.read('http://2.cdn.bravefrontier.gumi.sg/content/unit/img/unit_ills_battle_' + order[order_id] + '.png').then((image) => {
            console.log(order_id, 'received');
            return {
                image: image,
                pos: pos
            }
        }).catch(error => {
            console.error('Error on image#' + order_id);
            console.error(error);
        }));
    });

    Promise.all(promises).then(all => {
        new jimp(IMAGE_SIZE * 10, IMAGE_SIZE * 10, (err, image) => {
            all.forEach(i => {
                console.log('blit', i.pos);
                image.blit(i.image.scaleToFit(IMAGE_SIZE, IMAGE_SIZE), i.pos.x * IMAGE_SIZE, i.pos.y * IMAGE_SIZE);
            });
            console.log('saving', group);
            let groupStr;
            if (group < 10) {
                groupStr = '00' + group;
            } else if (group < 100) {
                groupStr = '0' + group;
            } else {
                groupStr = '' + group;
            }
            image.write(path.join('img', groupStr + '.png'), (err) => {
                let remainingKeys = Object.keys(order).filter(i => {
                    return i >= (group + 1) * 100;
                });

                if (remainingKeys.length) {
                    let nextGroup = Math.floor(remainingKeys[0] / GROUP_SIZE);
                    process.nextTick(schedule, order, nextGroup);
                } else {
                    process.nextTick(joinImages);
                }
            });
        });
    }).catch(err => {
        console.error(err);
    });
}

function joinImages() {
    fs.readdir('img', (err, files) => {
        new jimp(IMAGE_SIZE * 10, IMAGE_SIZE * 10 * files.length, (err, big) => {
            let promises = [];
            files.forEach((file, i) => {
                promises.push(jimp.read(path.join('img', file)).then((small) => {
                    big.blit(small, 0, IMAGE_SIZE * 10 * i);
                    fs.unlink(path.join('img', file));
                }));
            });
            Promise.all(promises).then(all => {
                big.write(path.join('img', 'master.png'), (err) => {

                });
            });
        });
    });
}

fs.readFile(path.join('bravefrontier_data', 'info.json'), 'utf8', (err, data) => {

    if (err) {
        console.error(err);
        return;
    }

    let info = JSON.parse(data);

    let order = {};

    for (let id in info) {
        // TODO units with alternate art!
        let unit = info[id];
        if (!order[unit.guide_id]) {
            // There are some duplicated guide_ids...
            order[unit.guide_id] = id;
        }
    }

    fs.writeFile('order.json', JSON.stringify(order, null, 4), (err) => {
        if (err) {
            console.error(err);
        }
    });

    schedule(order, 0);
});