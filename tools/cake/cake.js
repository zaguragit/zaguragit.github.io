
document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const input = e.currentTarget.input.value;
    output(JSON.stringify(tokenize(input)));
});

function output(o) {
    const element = document.getElementById("output");
    element.innerHTML = `<article>${o}</article>` + element.innerHTML;
}

function error(o) {
    const element = document.getElementById("output");
    element.innerHTML = `<article class=error>${o}</article>` + element.innerHTML;
}

const TokenIdentifier = "id";
const TokenNumber = "num";
const TokenPlus = "+";
const TokenMinus = "-";
const TokenMul = "*";
const TokenDiv = "/";
const TokenPow = "^";
const TokenEq = "=";
const TokenMore = ">";
const TokenLess = "<";

function tokenize(string) {
    let tokens = [];
    let length = string.length;
    for (let i = 0; i < length; i++) {
        let char = string[i];
        while (char.match(/[ ]/i))
            char = string[++i];
        if (char.match(/[a-zA-Z_]/i)) {
            let id = char;
            while (i + 1 < length && (char = string[i + 1]).match(/[a-zA-Z\-_]/i)) {
                id += char;
                i++;
            }
            tokens.push({ type: TokenIdentifier, val: id });
        }
        else if (char.match(/[0-9]/i)) {
            const radix = 10;
            let num = parseInt(char);
            while (i + 1 < length && (char = string[i + 1]).match(/[0-9_']/i)) {
                num = num * radix + parseInt(char);
                i++;
            }
            if (i + 1 < length && (char = string[i + 1]).match(/[.]/i)) {
                i++;
                let exponent = 0;
                while (i + 1 < length && (char = string[i + 1]).match(/[0-9_']/i)) {
                    num = num * radix + parseInt(char);
                    i++;
                    exponent--;
                }
                num *= Math.pow(10, exponent);
            }
            tokens.push({ type: TokenNumber, val: num });
        }
        else if (char == '+') tokens.push({ type: TokenPlus });
        else if (char == '-') tokens.push({ type: TokenMinus });
        else if (char == '*') tokens.push({ type: TokenMul });
        else if (char == '/') tokens.push({ type: TokenDiv });
        else if (char == '^') tokens.push({ type: TokenPow });
        else if (char == '=') tokens.push({ type: TokenEq });
        else if (char == '>') tokens.push({ type: TokenMore });
        else if (char == '<') tokens.push({ type: TokenLess });
        else {
            error(`Invalid Character '${char}'`);
        }
    }
    return tokens;
}