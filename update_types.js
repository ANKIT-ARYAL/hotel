const fs = require('fs');

let types = fs.readFileSync('src/components/homepage/types.ts', 'utf8');

types = types.replace(
  /headingFontSize\?: string;/,
  'headingFontSize?: string;\n    adminHeadingFontSize?: string;'
);

types = types.replace(
  /headingFontSize: '1rem',/,
  "headingFontSize: '1rem',\n    adminHeadingFontSize: '1.875rem',"
);

fs.writeFileSync('src/components/homepage/types.ts', types);
