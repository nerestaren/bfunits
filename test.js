const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const jimp = require('jimp');

function processGroup(all) {
    console.log('All for group' + all[0].group);

    let image = new jimp(1080, 1080, (err, image) => {
        all.forEach(i => {
            console.log('blit', i.pos);
            image.blit(i.image, i.pos.x * 108, i.pos.y * 108);
        });
        image.write(path.join('img', all[0].group + '.png'));
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
        let unit = info[id];
        /*order[unit.guide_id] = {
            id: id,
            name: unit.name,
            rarity: unit.rarity
        };*/
        order[unit.guide_id] = id;
    }

    let lastGroup = -1;
    let promises = [];

    for (let order_id in order) {

        let unitId = order[order_id];
        let idMinus1 = order_id - 1;

        let group = Math.floor(idMinus1 / 100);

        if (group !== lastGroup) {
            //TODO save image
            if (lastGroup !== -1) {
                Promise.all(promises[lastGroup]).then(processGroup).catch((all) => {
                    console.error(all);
                });
            }
            console.log('Guardant darrer grup: ', lastGroup);
            //TODO create image
            lastGroup = group;
            promises[group] = [];
        }

        let rem = idMinus1 % 100;

        let pos = {
            x: rem % 10,
            y: Math.floor(rem / 10)
        };

        promises[group].push(jimp.read('http://2.cdn.bravefrontier.gumi.sg/content/unit/img/unit_ills_battle_' + unitId + '.png').then((image) => {
            return {
                image: image,
                pos: pos,
                group: group
            }
        }).catch(error => {
            console.error('Error on image#' + idMinus1);
            console.error(error);
        }));


        //TODO get and save image
        //TODO async: await all promises or whatever from a group, then save
        console.log('Afegint ', order_id, ' a ', group, ' posició: ', pos);
    }

    //TODO save image
    console.log('Acabat. Guardant darrer grup: ', lastGroup);
    Promise.all(promises[lastGroup]).then(processGroup).catch((all) => {
        console.error(all);
    });


    fs.writeFile('order.json', JSON.stringify(order, null, 4), (err) => {
        if (err) {
            console.error(err);
        }
    });
});