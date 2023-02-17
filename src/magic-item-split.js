var fs = require('fs');

var md2json = require('md-2-json');
var mdContent = fs.readFileSync('./cc-srd5/magic-items.md').toString();

const json = md2json.parse(mdContent);

const regex = /\*(?<type>.+?)(?<!\(),(?![\w\s]*[\)])[\s]*(?<rarity>.+?)[\s]*(?<attunement>\(requires \[attunement]\(#section-attunement\).*?\))?[\s]*\*(?<description>.+)/is

/*  
 * Magic item formatting generally follows this pattern:
 * ### Title
 * *Item Type, rarity, optional: (requires [attunement](#section-attunement))*
 * Markdown-formatted description
 */
var cleanedJson = {};
for(item in json['Magic Items']['Magic Item Descriptions']) {
    const raw = json['Magic Items']['Magic Item Descriptions'][item].raw;
    console.log(regex.dotAll);
    console.log(raw);
    const [match, type, rarity, attunement, description] = regex.exec(raw.toString());
    console.log(`Type: ${type}, Rarity: ${rarity}, Attunement: ${attunement}, Description: ${description}`);
    cleanedJson = {...cleanedJson, [item]: {
        raw: raw,
        type: type.trim(),
        rarity: rarity.trim(),
        attunement: !!attunement,
        description: description.trim(),
    }}
}

fs.writeFile('./src/assets/magic-items.json', JSON.stringify(cleanedJson, null, 2), function (err) {
    if (err) throw {...err, ...{note: title}};
});