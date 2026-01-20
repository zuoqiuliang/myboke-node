const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');

console.log('=== Testing UUID Generation ===');
console.log('Using destructured v4:', uuidv4());
console.log('Using uuid.v4():', uuid.v4());
console.log('UUID version:', uuid.version(uuidv4()));
console.log('UUID package:', require('uuid/package.json').version);