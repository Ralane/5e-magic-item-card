var fs = require('fs');

var md2json = require('md-2-json');
var mdContent = fs.readFileSync('./cc-srd5/magic-items.md').toString();

const json = md2json.parse(mdContent);

const regex = /\*(?<type>.+),\s*(?<rarity>[^\s()]+)\s*(?<attunement>\(requires\s*\[attunement]\(#section-attunement\)\))?\s*\*(?<description>.+)/si;

/*
 * Magic item formatting generally follows this pattern:
 * ### Title
 * *Item Type, rarity, optional: (requires [attunement](#section-attunement))*
 * Markdown-formatted description
 */
var cleanedJson = {};
for(item in json['Magic Items']['Magic Item Descriptions']) {
    const raw = json['Magic Items']['Magic Item Descriptions'][item].raw;
    const regexResults = regex.exec(raw);
    console.log(JSON.stringify(regexResults));
    cleanedJson = {...cleanedJson, [item]: {
        raw: raw,
        type: regexResults.groups['type'],
        rarity: regexResults.groups['rarity'],
        attunement: !!regexResults.groups['attunement'],
        description: regexResults.groups['description'],
    }}
}

fs.writeFile('./src/assets/magic-items.json', JSON.stringify(cleanedJson, null, 2), function (err) {
    if (err) throw {...err, ...{note: title}};
});