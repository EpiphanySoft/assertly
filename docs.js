'use strict';

const Assert = require('./Assert');
const $fs = require('fs');
const $path = require('path');

debugger
Assert.setup();

let entries = Assert.registry;
let keys = Object.keys(entries);

keys.sort();

let canon = keys.filter(key => !entries[key].fn || key === entries[key].name);

// console.log(`paths[${paths.length}] = `, paths);

function logInfo (name) {
    let aliases = keys.filter(k => k !== name && name === entries[k].name);

    if (aliases.length) {
        aliases.sort();
        aliases = ` (aka: "${aliases.join('", "')}")`;
    }
    else {
        aliases = '';
    }

    console.log(` - [\`${name}\`](docs/${name}.md)${aliases}`);

    let path = $path.join(__dirname, `docs/${name}.md`);
    let md = 'TODO';

    try {
        $fs.readFileSync(path);
    }
    catch (e) {
        $fs.writeFileSync(path, `# ${name}\n\nTODO`);
    }
}

console.log('## Assertions\n');

canon.forEach(name => {
    const entry = entries[name];

    if (entry.def.evaluate && name === entry.def.name) {
        logInfo(name);
    }
});

console.log('\n## Methods\n');

canon.forEach(name => {
    const entry = entries[name];

    if (entry.def.invoke && name === entry.def.name) {
        logInfo(name);
    }
});
