'use strict';

const Assert = require('./Assert');
const $fs = require('fs');
const $path = require('path');

Assert.setup();

let entries = Assert.entries;
let keys = Object.keys(entries);

keys.sort();

let paths = {};

let canon = keys.filter(key => key !== '$' &&
        (!entries[key].fn || key === entries[key].canonicalName));

function buildPath (path, modifier, state) {
    if (state[modifier]) {
        return;
    }

    state[modifier] = true;

    if (path) {
        path += '.';
    }
    path += modifier;

    let entry = entries[modifier];

    if (entry.fn && canon.indexOf(modifier) > -1) {
        // console.log(path);
        paths[path] = true;
    }

    for (let name of entry.all) {
        buildPath(path, name, state);
    }

    state[modifier] = false;
}

// entries.$.all.forEach(modifier => {
//     buildPath('', modifier, {});
// });

entries.to.all.forEach(modifier => {
    buildPath('to[.not]', modifier, { not: true });
});

paths = Object.keys(paths);
// console.log(`paths[${paths.length}] = `, paths);

canon.forEach(name => {
    const entry = entries[name];

    if (entry.fn && entry.canonicalName === name) {
        let aliases = keys.filter(k => k !== name && entries[k].canonicalName === name);

        if (aliases.length) {
            aliases.sort();
            aliases = ` (aka: "${aliases.join('", "')}")`;
        }
        else {
            aliases = '';
        }

        console.log(`### ${name}${aliases}\n`);

        let forms = paths.filter(p => p.endsWith('.' + name));
        console.log(` - ${forms.join('\n - ')}\n`);

        let path = $path.join(__dirname, `docs/${name}.md`);
        let md = 'TODO';

        try {
            md = $fs.readFileSync(path);
        }
        catch (e) {
            $fs.writeFileSync(path, md);
        }

        console.log(md + '\n');
    }
});
