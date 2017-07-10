#!/bin/node

const fs = require('fs');
const path = require('path');

let info = fs.readFileSync(path.join('bravefrontier_data', 'info.json'));
info = JSON.parse(info);

let bbs = {}/*, sbb = [], ubb = []*/;
let units = {};

Object.keys(info).forEach((id) => {
    let unit = info[id];
    let name = unit.name;
    let rarity = unit.rarity;
    if (unit.bb) {
        let desc = unit.bb.desc;

        units[id] = {
            id: id,
            name: name,
            desc: desc,
            cost: unit.bb.levels[9]['bc cost'],
            effects: []
        };

        unit.bb.levels[9].effects.forEach(e => {
            let proc_id = e['proc id'];
            if (!bbs[proc_id]) {
                bbs[proc_id] = [];
            }
            bbs[proc_id].push({
                effect: e,
                cost: unit.bb.levels[9]['bc cost'],
                unit: {
                    id: id,
                    name: name
                },
                desc: desc
            });
            units[id].effects.push(e);
        });
    }
});

fs.writeFileSync('bb_analysis.json', JSON.stringify({
    bbs: bbs,
    units: units
}, null, 2));