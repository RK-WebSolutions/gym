const fs = require('fs');
const html = fs.readFileSync('public/gymate/home2-source.html', 'utf8');
const match = html.match(/class-item[\s\S]{0,1000}/);
if (match) console.log(match[0]);
