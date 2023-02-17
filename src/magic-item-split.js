var fs = require('fs');

var md2json = require('md-2-json');
var mdContent = fs.readFileSync('./src/assets/cc-srd5/magic-items.md').toString();

var json = md2json.parse(mdContent);

fs.writeFile('./src/assets/magic-items.json', JSON.stringify(json, null, 2), function (err) {
    if (err) throw {...err, ...{note: title}};
});