// index.js
const fs = require('fs');
const { tokenize } = require('./lexer');
const { parse } = require('./parser');
const { run } = require('./interpreter');

const code = fs.readFileSync('./examples/hello.uzs', 'utf-8');
const tokens = tokenize(code);
const ast = parse(tokens);

run(ast);
