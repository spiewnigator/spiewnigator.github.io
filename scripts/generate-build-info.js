const fs = require('fs');
const path = require('path');

const buildInfo = {
  timestamp: new Date().toISOString(),
};

const outputPath = path.join(__dirname, '../src/assets/build-info.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2), 'utf8');
console.log(`Build info generated at ${outputPath}`);