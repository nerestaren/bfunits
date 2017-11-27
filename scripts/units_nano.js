let fs = require('fs');
let path = require('path');

module.exports.run = function() {
    let info = fs.readFileSync(path.join('bravefrontier_data', 'info.json'));
    info = JSON.parse(info);

    let mini = {};

    Object.keys(info).forEach(id => {
        let unit = info[id];
        mini[id] = {
            element: unit.element,
            guide_id: unit.guide_id,
            id: unit.id,
            name: unit.name,
            rarity: unit.rarity,
        }
    });

    fs.writeFileSync(path.join('bravefrontier_data_processed', 'units_nano.json'), JSON.stringify(mini, null, 2));
};