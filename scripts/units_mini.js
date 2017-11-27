let fs = require('fs');
let path = require('path');

module.exports.run = function() {
    let info = fs.readFileSync(path.join('bravefrontier_data', 'info.json'));
    info = JSON.parse(info);

    let mini = {};

    Object.keys(info).forEach(id => {
        let unit = info[id];
        mini[id] = {
            bb: unit.bb ? unit.bb.desc : undefined,
            category: unit.category,
            cost: unit.cost,
            element: unit.element,
            es: unit['extra skill'] ? unit['extra skill'].desc : undefined,
            gender: unit.gender,
            guide_id: unit.guide_id,
            id: unit.id,
            ls: unit['leader skill'] ? unit['leader skill'].desc : undefined,
            name: unit.name,
            rarity: unit.rarity,
            sbb: unit.sbb ? unit.sbb.desc : undefined,
            ubb: unit.ubb ? unit.ubb.desc : undefined,
        }
    });

    fs.writeFileSync(path.join('bravefrontier_data_processed', 'units_mini.json'), JSON.stringify(mini, null, 2));
};