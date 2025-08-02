const keywords = ['chiqar', 'agar', 'aks', 'holda', 'takror', 'funksiya', 'qaytar', 'kirit'];

const token_specs = [
    { type: 'whitespace', regex: /^\s+/ },
    { type: 'number',     regex: /^\d+(\.\d+)?/ },
    { type: 'string', regex: /^"([^"]*)"/, extract: true },
    { type: 'operator',   regex: /^[\+\-\*\/=<>!]+/ },
    { type: 'paren',      regex: /^[\(\)]/ },
    { type: 'colon',      regex: /^:/ },
    { type: 'newline',    regex: /^\n/ },
    { type: 'identifier', regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ },
];

function tokenize(input) {
    const tokens = [];
    let line = 1;

    while (input.length > 0) {
        let matched = false;

        for (const spec of token_specs) {
            const match = input.match(spec.regex);
            if (match) {
                const value = match[0];
                input = input.slice(value.length);

                if (spec.type === 'whitespace') {
                    matched = true;
                    break;
                }

                if (spec.type === 'newline') {
                    line++;
                    matched = true;
                    break;
                }

                let tokenType = spec.type;
                if (tokenType === 'identifier' && keywords.includes(value)) {
                    tokenType = 'keyword';
                }

                let tokenValue = value;
                if (spec.type === 'string' && spec.extract) {
                    tokenValue = match[1]; // remove the quotes, keep inner text
                }
                tokens.push({ type: tokenType, value: tokenValue, line });
                matched = true;
                break;
            }
        }

        if (!matched) {
            throw new Error(`Unrecognized token at line ${line}: "${input.slice(0, 10)}"`);
        }
    }

    return tokens;
}

module.exports = {tokenize};
