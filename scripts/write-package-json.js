const fs = require('fs')
const magic = 'MODULE_TYPE'
const package = `{
  "type": "${magic}"
}`

fs.writeFileSync('./lib/mjs/package.json', package.replace(magic, 'module'))
fs.writeFileSync('./lib/cjs/package.json', package.replace(magic, 'commonjs'))