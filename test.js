const fs = require('fs');
const path = require('path');

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

    for (let order_id in order) {

        let idMinus1 = order_id - 1;

        let group = Math.floor(idMinus1/ 100);

        if (group != lastGroup) {
            //TODO save image
            console.log('Guardant darrer grup: ', lastGroup);
            //TODO create image
            lastGroup = group;
        }

        let rem = idMinus1 % 100;

        let pos = {
            x: rem % 10,
            y: Math.floor(rem / 10)
        };

        //TODO get and save image
        //TODO async: await all promises or whatever from a group, then save
        console.log('Afegint ', order_id, ' a ', group, ' posició: ', pos);
    }

    //TODO save image
    console.log('Acabat. Guardant darrer grup: ', lastGroup);


    fs.writeFile('order.json', JSON.stringify(order, null, 4), (err) => {
        if (err) {
            console.error(err);
        }
    });
});