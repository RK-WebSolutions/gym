const fs = require('fs');
// Let's just output the CSS rules containing class-icon from elementor.css
const css = fs.readFileSync('public/gymate/assets/elementor.css', 'utf8');
const matches = css.match(/[^{]*class-icon[^{]*\{[^}]*\}/gi);
console.log(matches ? matches.join('\n') : 'Not found');
