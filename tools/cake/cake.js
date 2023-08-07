"use strict";

document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const input = e.currentTarget.input.value;
    e.currentTarget.input.value = "";
    const ast = parse(tokenize(input));
    output(ast, evaluate(ast));
});

function debug(o) {
    const element = document.getElementById("output");
    element.innerHTML = `<pre>${JSON.stringify(o, null, 2)}</pre>` + element.innerHTML;
}

function output(ast, o) {
    const element = document.getElementById("output");
    element.innerHTML = `<article><header>${render_exp(ast)}</header><div>${o}</div></article>` + element.innerHTML;
}

function render_exp(exp, extra) {
    switch (exp.type) {
        case TokenNumber: return `<span class=token-num>${exp.val}</span>`;
        case TokenIdentifier: return `<span class=token-id>${exp.val}</span>`;
        case "unop": switch (exp.op) {
            case UnOpNeg: return "<span class=token-op>-</span>" + render_exp(exp.operand);
            case UnOpNot: return "<span class=token-op>not</span> " + render_exp(exp.operand);
        }
        case "biop":
            const p = { parent_precedence: exp.op.precedence };
            const pr = { parent_precedence: exp.op.precedence, right_operand: true };
            let r;
            switch (exp.op) {
                case BiOpPlus: r = render_exp(exp.left, p) + " <span class=token-op>+</span> " + render_exp(exp.right, pr); break;
                case BiOpMinus: r = render_exp(exp.left, p) + " <span class=token-op>-</span> " + render_exp(exp.right, pr); break;
                case BiOpMul: r = render_exp(exp.left, p) + " <span class=token-op>*</span> " + render_exp(exp.right, pr); break;
                case BiOpDiv: r = render_exp(exp.left, p) + " <span class=token-op>/</span> " + render_exp(exp.right, pr); break;
                case BiOpPow: r = render_exp(exp.left, p) + " <span class=token-op>^</span> " + render_exp(exp.right, pr); break;
                case BiOpEq: r = render_exp(exp.left, p) + " <span class=token-op>equals</span> " + render_exp(exp.right, pr); break;
                case BiOpMore: r = render_exp(exp.left, p) + " <span class=token-op>></span> " + render_exp(exp.right, pr); break;
                case BiOpLess: r = render_exp(exp.left, p) + " <span class=token-op><</span> " + render_exp(exp.right, pr); break;
                case BiOpAnd: r = render_exp(exp.left, p) + " <span class=token-op>and</span> " + render_exp(exp.right, pr); break;
                case BiOpOr: r = render_exp(exp.left, p) + " <span class=token-op>or</span> " + render_exp(exp.right, pr); break;
            }
            if (extra)
                if (extra.parent_precedence > p.parent_precedence || extra.right_operand && extra.parent_precedence == p.parent_precedence)
                    r = `(${r})`;
            return r;
        default: "ERROR: Undefined Operation"
    }
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
            let loc = [fi, i + 1];
            switch (id) {
                case "and": tokens.push({ type: TokenAnd, loc: loc }); break;
                case "or": tokens.push({ type: TokenOr, loc: loc }); break;
                case "not": tokens.push({ type: TokenNot, loc: loc }); break;
                case "of": tokens.push({ type: TokenOf, loc: loc }); break;
                case "plus": tokens.push({ type: TokenPlus, loc: loc }); break;
                case "minus": tokens.push({ type: TokenMinus, loc: loc }); break;
                case "times":
                case "by": tokens.push({ type: TokenMul, loc: loc }); break;
                case "equals":
                case "eq": tokens.push({ type: TokenEq, loc: loc }); break;
                default: tokens.push({ type: TokenIdentifier, loc: loc, val: id });
            }
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

function evaluate(exp) {
    switch (exp.type) {
        case TokenNumber: return exp.val;
        case "unop": switch (exp.op) {
            case UnOpNeg: return -evaluate(exp.operand);
            case UnOpNot: return !evaluate(exp.operand);
        }
        case "biop": switch (exp.op) {
            case BiOpPlus: return evaluate(exp.left) + evaluate(exp.right)
            case BiOpMinus: return evaluate(exp.left) - evaluate(exp.right)
            case BiOpMul: return evaluate(exp.left) * evaluate(exp.right)
            case BiOpDiv: return evaluate(exp.left) / evaluate(exp.right)
            case BiOpPow: return Math.pow(evaluate(exp.left), evaluate(exp.right));
            case BiOpEq: return evaluate(exp.left) == evaluate(exp.right)
            case BiOpMore: return evaluate(exp.left) > evaluate(exp.right)
            case BiOpLess: return evaluate(exp.left) < evaluate(exp.right)
            case BiOpAnd: return evaluate(exp.left) && evaluate(exp.right)
            case BiOpOr: return evaluate(exp.left) || evaluate(exp.right)
        }
        default: "ERROR: Undefined Operation"
    }
}