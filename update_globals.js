const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

css = css.replace(/font-size: var\(--theme-heading-size, inherit\);/g, '');
css = css.replace(/font-size: var\(--theme-body-size, inherit\);/g, '');

fs.writeFileSync('src/app/globals.css', css);
