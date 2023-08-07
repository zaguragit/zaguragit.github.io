"use strict";

document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const input = e.currentTarget.input.value;
    e.currentTarget.input.value = "";
    output(JSON.stringify(parse(tokenize(input)), null, 2));
});

function output(o) {
    const element = document.getElementById("output");
    element.innerHTML = `<article><pre>${o}</pre></article>` + element.innerHTML;
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
const TokenPercent = "%";
const TokenPow = "^";
const TokenEq = "=";
const TokenMore = ">";
const TokenLess = "<";
const TokenOpenParen = "(";
const TokenCloseParen = ")";
const TokenOpenBracket = "[";
const TokenCloseBracket = "]";
const TokenAnd = "and";
const TokenOr = "or";
const TokenNot = "not";
const TokenOf = "of";

function tokenize(string) {
    let tokens = [];
    let length = string.length;
    for (let i = 0; i < length; i++) {
        let fi = i;
        let char = string[i];
        while (char.match(/[ ]/i))
            char = string[++i];
        if (char.match(/[a-zA-Z_]/i)) {
            let id = char;
            while (i + 1 < length && (char = string[i + 1]).match(/[a-zA-Z\-_]/i)) {
                id += char;
                i++;
            }
            if (id in [TokenAnd, TokenOr, TokenNot, TokenOf])
                tokens.push({ type: id, loc: [fi, i + 1] });
            else
                tokens.push({ type: TokenIdentifier, loc: [fi, i + 1], val: id });
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
            tokens.push({ type: TokenNumber, loc: [fi, i + 1], val: num });
        }
        else if (char == '+') tokens.push({ type: TokenPlus, loc: [fi, i + 1] });
        else if (char == '-') tokens.push({ type: TokenMinus, loc: [fi, i + 1] });
        else if (char == '*') tokens.push({ type: TokenMul, loc: [fi, i + 1] });
        else if (char == '/') tokens.push({ type: TokenDiv, loc: [fi, i + 1] });
        else if (char == '^') tokens.push({ type: TokenPow, loc: [fi, i + 1] });
        else if (char == '=') tokens.push({ type: TokenEq, loc: [fi, i + 1] });
        else if (char == '>') tokens.push({ type: TokenMore, loc: [fi, i + 1] });
        else if (char == '<') tokens.push({ type: TokenLess, loc: [fi, i + 1] });
        else if (char == '(') tokens.push({ type: TokenOpenParen, loc: [fi, i + 1] });
        else if (char == ')') tokens.push({ type: TokenCloseParen, loc: [fi, i + 1] });
        else if (char == '[') tokens.push({ type: TokenOpenBracket, loc: [fi, i + 1] });
        else if (char == ']') tokens.push({ type: TokenCloseBracket, loc: [fi, i + 1] });
        else {
            error(`Invalid Character '${char}'`);
        }
    }
    return tokens;
}

class ParseContext {
    constructor(tokens) {
        this.tokens = tokens;
        this.i = 0;
    }
    next() { return this.tokens[this.i++] ?? { "type": "EOF" }; }
    peek(o) { return this.tokens[this.i + o] ?? { "type": "EOF" }; }
    get current() { return this.tokens[this.i] ?? { "type": "EOF" }; }
    expect(token_type) {
        const c = this.next();
        if (c.type !== token_type)
            error(`Expected ${token_type}, but got ${c.type}`);
        return c;
    }
}

function parse(tokens) {
    let context = new ParseContext(tokens);
    let ast = parse_expression(context);
    context.expect("EOF");
    return ast;
}

function parse_expression(context) { return parse_binary(context, 0) }

const BiOpPow = { type: "^", precedence: 7 };
const BiOpMul = { type: "*", precedence: 6 };
const BiOpDiv = { type: "/", precedence: 6 };
const BiOpPlus = { type: "+", precedence: 5 };
const BiOpMinus = { type: "-", precedence: 5 };
const BiOpOf = { type: "of", precedence: 4 };
const BiOpEq = { type: "=", precedence: 3 };
const BiOpMore = { type: ">", precedence: 3 };
const BiOpLess = { type: "<", precedence: 3 };
const BiOpAnd = { type: "and", precedence: 3 };
const BiOpOr = { type: "or", precedence: 3 };

function get_bi_op(token_type) {
    switch (token_type) {
        case TokenPlus: return BiOpPlus;
        case TokenMinus: return BiOpMinus;
        case TokenMul: return BiOpMul;
        case TokenDiv: return BiOpDiv;
        case TokenPow: return BiOpPow;
        case TokenEq: return BiOpEq;
        case TokenMore: return BiOpMore;
        case TokenLess: return BiOpLess;
        case TokenAnd: return BiOpAnd;
        case TokenOr: return BiOpOr;
        case TokenOf: return BiOpOf;
        default: return null;
    }
}

const UnOpNot = { type: "not" };
const UnOpNeg = { type: "-" };

function get_un_op(token_type) {
    switch (token_type) {
        case TokenMinus: return UnOpNeg;
        case TokenNot: return UnOpNot;
        default: return null;
    }
}

function parse_binary(context, parent_precedence) {
    let left = parse_unary(context);
    while (true) {
        const c = context.current;
        const op = get_bi_op(c.type);
        const op_loc = c.loc;
        if (!op || op.precedence <= parent_precedence)
            return left;
        context.next();
        const right = parse_binary(context, op.precedence);
        const loc = [left.loc[0], right.loc[1]];
        left = { type: "biop", loc: loc, op: op, left: left, right: right };
    }
}

function parse_unary(context) {
    const c = context.current;
    const op = get_un_op(c.type);
    const op_loc = c.loc;
    if (!op)
        return parse_post_unary(parse_primary(context));
    context.next();
    const a = parse_unary(context);
    const loc = [op_loc[0], a.loc[1]];
    return { type: "unop", loc: loc, op: op, operand: a };
}

function parse_post_unary(pre, context) {
    return pre;
}

function parse_primary(context) {
    const t = context.next();
    switch (t.type) {
        case TokenNumber: return t;
        case TokenIdentifier: return t;
        case TokenOpenParen: {
            const exp = parse_expression(context);
            context.expect(TokenCloseParen);
            return exp;
        }
        case TokenOpenBracket: {
            const exp = parse_expression(context);
            context.expect(TokenCloseBracket);
            return exp;
        }
        default:
            error("Expected one of:\n" +
                "    <identifier>, <number>\n" +
                `but got ${t.type}`);
            return { type: "ERROR", loc: t.loc };
    }
}