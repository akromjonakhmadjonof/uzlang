// parser.js

function parse(tokens) {
    let position = 0;

    function peek() {
        return tokens[position];
    }

    function consume(expectedType) {
        const token = tokens[position];
        if (!token || token.type !== expectedType) {
            throw new Error(`Expected ${expectedType}, got ${token?.type} at line ${token?.line}`);
        }
        position++;
        return token;
    }

    function match(type, value = null) {
        const token = tokens[position];
        if (token && token.type === type && (value === null || token.value === value)) {
            position++;
            return token;
        }
        return null;
    }

    function parseExpression() {
        let left = parsePrimary();

        while (peek() && peek().type === 'operator' && peek().value === '+') {
            const op = match('operator').value;
            const right = parsePrimary();
            left = {
                type: 'CallExpression',
                name: op,
                args: [left, right],
            };
        }

        return left;
    }

    function parsePrimary() {
        const token = peek();

        if (token.type === 'string') {
            position++;
            return { type: 'StringLiteral', value: token.value };
        }

        if (token.type === 'number') {
            position++;
            return { type: 'NumberLiteral', value: parseFloat(token.value) };
        }

        if (token.type === 'identifier') {
            const id = token.value;
            position++;

            // Function call?
            if (match('paren', '(')) {
                const args = [];
                while (peek().type !== 'paren' || peek().value !== ')') {
                    args.push(parseExpression());
                    if (peek().value === ',') position++;
                }
                consume('paren'); // ')'
                return { type: 'CallExpression', name: id, args };
            }

            return { type: 'Variable', name: id };
        }

        if (token.type === 'keyword' && token.value === 'kirit') {
            position++;
            consume('paren'); // (
            consume('paren'); // )
            return { type: 'CallExpression', name: 'kirit', args: [] };
        }

        throw new Error(`Unexpected token in expression: ${token.value}`);
    }

    function parseStatement() {
        const token = peek();

        // Assignment
        if (token.type === 'identifier' && tokens[position + 1]?.value === '=') {
            const name = token.value;
            position += 2; // skip identifier and '='
            const expr = parseExpression();
            return { type: 'Assignment', name, value: expr };
        }

        // Call expression (like chiqar(...))
        if (token.type === 'keyword' && token.value === 'chiqar') {
            position++;
            consume('paren'); // (
            const arg = parseExpression();
            consume('paren'); // )
            return { type: 'PrintStatement', value: arg };
        }

        throw new Error(`Unknown statement starting with: ${token.value}`);
    }

    function parseProgram() {
        const statements = [];
        while (position < tokens.length) {
            if (peek().type === 'newline') {
                position++; // skip blank lines
                continue;
            }
            statements.push(parseStatement());
        }
        return { type: 'Program', body: statements };
    }

    return parseProgram();
}

module.exports = { parse };
