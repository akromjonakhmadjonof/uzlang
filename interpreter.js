// interpreter.js

const readlineSync = require('readline-sync'); // for `kirit()`

function run(program) {
    const env = {}; // variable environment

    function evalNode(node) {
        switch (node.type) {
            case 'Program':
                for (const stmt of node.body) {
                    evalNode(stmt);
                }
                break;

            case 'Assignment':
                env[node.name] = evalNode(node.value);
                break;

            case 'PrintStatement':
                console.log(evalNode(node.value));
                break;

            case 'StringLiteral':
                return node.value;

            case 'NumberLiteral':
                return node.value;

            case 'Variable':
                if (env[node.name] === undefined) {
                    throw new Error(`O'zgaruvchi "${node.name}" aniqlanmagan`);
                }
                return env[node.name];

            case 'CallExpression':
                return callFunction(node.name, node.args.map(evalNode));
        }
    }

    function callFunction(name, args) {
        if (name === 'kirit') {
            return readlineSync.question('> ');
        }

        if (name === '+') {
            return args[0] + args[1];
        }

        throw new Error(`Funktsiya "${name}" topilmadi`);
    }

    evalNode(program);
}

module.exports = { run };
