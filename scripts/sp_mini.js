let fs = require('fs');
let path = require('path');

module.exports.run = function() {
    let info = fs.readFileSync(path.join('bravefrontier_data', 'feskills.json'));
    info = JSON.parse(info);

    let mini = {};

    Object.keys(info).forEach(id => {
        let skills = [];
        info[id].skills.forEach(entry => {
            skills.push({
                bp: entry.skill.bp,
                dependency: entry.dependency !== "" ? true : undefined,
                desc: entry.skill.desc
            });
        });
        mini[id] = skills;
    });

    fs.writeFileSync(path.join('bravefrontier_data_processed', 'sp_mini.json'), JSON.stringify(mini, null, 2));
};