"use strict";

var last_answer = 0;

document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const input = e.currentTarget.input.value;
    e.currentTarget.input.value = "";
    const ast = parse(tokenize(input));
    last_answer = evaluate(ast);
    output(ast, last_answer);
});

function debug(o) {
    const element = document.getElementById("output");
    element.innerHTML = `<pre>${JSON.stringify(o, null, 2)}</pre>` + element.innerHTML;
}

function output(ast, o) {
    const element = document.getElementById("output");
    element.innerHTML = `<article><header>${render_exp(ast)}</header><div>${render_evaluated(o)}</div></article>` + element.innerHTML;
}

function escape_html(str){
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

function error(o) {
    const element = document.getElementById("output");
    element.innerHTML = `<article class=error>${escape_html(o)}</article>` + element.innerHTML;
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
const TokenComma = ",";
const TokenAnd = "and";
const TokenOr = "or";
const TokenNot = "not";
const TokenAbs = "abs";
const TokenSqrt = "sqrt";
const TokenSin = "sin";
const TokenCos = "cos";
const TokenTan = "tan";
const TokenFloor = "floor";
const TokenCeil = "ceil";
const TokenRound = "round";
const TokenTrunc = "trunc";
const TokenFract = "fract";
const TokenExp = "exp";
const TokenLn = "ln";
const TokenLog = "log";
const TokenRandom = "random";
const TokenPi = "pi";
const TokenE = "E";
const TokenOf = "of";
const TokenIn = "in";
const TokenTo = "to";
const TokenRange = "range";
const TokenConvert = "convert";
const TokenLet = "let";
const TokenAns = "ans";

function tokenize(string) {
    let tokens = [];
    let length = string.length;
    for (let i = 0; i < length; i++) {
        let fi = i;
        let char = string[i];
        while (char.match(/[ ]/i))
            char = string[++i];
        if (char.match(/[a-zA-Z_]/i)) {
            let id = char.toLowerCase();
            while (i + 1 < length && (char = string[i + 1]).match(/[a-zA-Z\-_]/i)) {
                id += char.toLowerCase();
                i++;
            }
            let loc = [fi, i + 1];
            switch (id) {
                case "and": tokens.push({ type: TokenAnd, loc }); break;
                case "or": tokens.push({ type: TokenOr, loc }); break;
                case "not": tokens.push({ type: TokenNot, loc }); break;
                case "plus": tokens.push({ type: TokenPlus, loc }); break;
                case "minus": tokens.push({ type: TokenMinus, loc }); break;
                case "times":
                case "by": tokens.push({ type: TokenMul, loc }); break;
                case "equals":
                case "eq": tokens.push({ type: TokenEq, loc }); break;
                case "abs": tokens.push({ type: TokenAbs, loc }); break;
                case "sqrt": tokens.push({ type: TokenSqrt, loc }); break;
                case "sin": tokens.push({ type: TokenSin, loc }); break;
                case "cos": tokens.push({ type: TokenCos, loc }); break;
                case "tan": tokens.push({ type: TokenTan, loc }); break;
                case "floor": tokens.push({ type: TokenFloor, loc }); break;
                case "ceil": tokens.push({ type: TokenCeil, loc }); break;
                case "round": tokens.push({ type: TokenRound, loc }); break;
                case "truncate":
                case "trunc": tokens.push({ type: TokenTrunc, loc }); break;
                case "fract": tokens.push({ type: TokenFract, loc }); break;
                case "exp": tokens.push({ type: TokenExp, loc }); break;
                case "ln": tokens.push({ type: TokenLn, loc }); break;
                case "log": tokens.push({ type: TokenLog, loc }); break;
                case "random":
                case "rand": tokens.push({ type: TokenRandom, loc }); break;
                case "pi": tokens.push({ type: TokenPi, loc }); break;
                case "e": tokens.push({ type: TokenE, loc }); break;
                case "of": tokens.push({ type: TokenOf, loc }); break;
                case "in": tokens.push({ type: TokenIn, loc }); break;
                case "to": tokens.push({ type: TokenTo, loc }); break;
                case "range": tokens.push({ type: TokenRange, loc }); break;
                case "convert": tokens.push({ type: TokenConvert, loc }); break;
                case "let": tokens.push({ type: TokenLet, loc }); break;
                case "answer":
                case "ans": tokens.push({ type: TokenAns, loc }); break;
                default: tokens.push({ type: TokenIdentifier, loc, val: id });
            }
        }
        else if (char.match(/[0-9]/i)) {
            const radix = 10;
            let num = parseInt(char);
            while (i + 1 < length && (char = string[i + 1]).match(/[0-9_']/i)) {
                i++;
                if (char.match(/[_']/i))
                    continue;
                num = num * radix + parseInt(char);
            }
            if (i + 1 < length && (char = string[i + 1]).match(/[.]/i)) {
                i++;
                let exponent = 0;
                while (i + 1 < length && (char = string[i + 1]).match(/[0-9_']/i)) {
                    i++;
                    if (char.match(/[_']/i))
                        continue;
                    num = num * radix + parseInt(char);
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
        else if (char == ',') tokens.push({ type: TokenComma, loc: [fi, i + 1] });
        else if (char == 'π') tokens.push({ type: TokenPi, loc: [fi, i + 1] });
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

const BiOpPow = { type: "^", precedence: 8 };
const BiOpLog = { type: "log", precedence: 7 };
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
const UnOpAbs = { type: "abs" };
const UnOpSin = { type: "sin" };
const UnOpCos = { type: "cos" };
const UnOpTan = { type: "tan" };
const UnOpFloor = { type: "floor" };
const UnOpCeil = { type: "ceil" };
const UnOpRound = { type: "round" };
const UnOpTrunc = { type: "trunc" };
const UnOpFract = { type: "fract" };
const UnOpExp = { type: "exp" };
const UnOpLn = { type: "ln" };

function get_un_op(token_type) {
    switch (token_type) {
        case TokenMinus: return UnOpNeg;
        case TokenNot: return UnOpNot;
        case TokenAbs: return UnOpAbs;
        case TokenSin: return UnOpSin;
        case TokenCos: return UnOpCos;
        case TokenTan: return UnOpTan;
        case TokenFloor: return UnOpFloor;
        case TokenCeil: return UnOpCeil;
        case TokenRound: return UnOpRound;
        case TokenTrunc: return UnOpTrunc;
        case TokenFract: return UnOpFract;
        case TokenExp: return UnOpExp;
        case TokenLn: return UnOpLn;
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
        left = { type: "biop", loc, op, left, right };
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
    return { type: "unop", loc, op, operand: a };
}

function parse_post_unary(pre, context) {
    return pre;
}

function parse_primary(context) {
    const t = context.next();
    switch (t.type) {
        case TokenAns: return t;
        case TokenNumber: return t;
        case TokenPi: return t;
        case TokenE: return t;
        case TokenIdentifier: return t;
        case TokenLet: {
            const id = context.expect(TokenIdentifier);
            context.expect(TokenEq);
            const val = parse_expression(context);
            if (context.current.type === TokenIn) {
                context.next();
                let in_exp = parse_expression(context);
                const loc = [t.loc[0], in_exp.loc[1]];
                return { type: TokenLet, loc, id, val, in_exp };
            }
            const loc = [t.loc[0], val.loc[1]];
            return { type: TokenLet, loc, id, val };
        }
        case TokenConvert: {
            const operand = parse_expression(context);
            const from = parse_unit(context);
            context.expect(TokenTo);
            const to = parse_unit(context);
            const loc = [t.loc[0], to.loc[1]];
            return { type: TokenConvert, loc, operand, from, to }
        }
        case TokenOpenParen: {
            const exp = parse_expression(context);
            if (context.current.type == TokenComma) {
                const list = [exp];
                while (context.current.type == TokenComma) {
                    context.next();
                    if (context.current.type == TokenCloseParen)
                        break;
                    list.push(parse_expression(context))
                }
                let e = context.expect(TokenCloseParen);
                const loc = [t.loc[0], e.loc[1]];
                return { type: "vector", loc, list }
            }
            context.expect(TokenCloseParen);
            return exp;
        }
        case TokenOpenBracket: {
            const exp = parse_expression(context);
            if (context.current.type == TokenComma) {
                const list = [exp];
                while (context.current.type == TokenComma) {
                    context.next();
                    if (context.current.type == TokenCloseBracket)
                        break;
                    list.push(parse_expression(context))
                }
                let e = context.expect(TokenCloseBracket);
                const loc = [t.loc[0], e.loc[1]];
                return { type: "vector", loc, list }
            }
            context.expect(TokenCloseBracket);
            return exp;
        }
        case TokenSqrt: {
            const left = parse_binary(context, 99);
            const loc = [t.loc[0], left.loc[1]];
            return { type: "biop", loc, op: BiOpPow, left, right: { type: TokenNumber, val: 0.5 } };
        }
        case TokenLog: {
            const left = parse_binary(context, 99);
            const right = parse_binary(context, 99);
            const loc = [t.loc[0], right.loc[1]];
            return { type: "biop", loc, op: BiOpLog, left, right };
        }
        case TokenRange: {
            let start_excl;
            switch (context.next().type) {
                case TokenOpenParen: start_excl = true; break;
                case TokenOpenBracket: start_excl = false; break;
                default: 
                    error(`Expected [ or (, but got ${t.type}`);
            }
            const start = parse_expression(context);
            context.expect(TokenComma);
            const end = parse_expression(context);
            let end_excl;
            const e = context.next();
            switch (e.type) {
                case TokenCloseParen: end_excl = true; break;
                case TokenCloseBracket: end_excl = false; break;
                default: 
                    error(`Expected ] or ), but got ${t.type}`);
            }
            const loc = [t.loc[0], e.loc[1]];
            return { type: TokenRange, loc, start, end, start_excl, end_excl };
        }
        case TokenRandom:
            context.expect(TokenIn);
            const range = parse_binary(context, 99);
            const loc = [t.loc[0], range.loc[1]];
            return { type: TokenRandom, loc, range };
        default:
            error("Expected one of: " +
                "<identifier>, <number>, <operator>, (, [, range, random" +
                ` but got ${t.type}`);
            return { type: "ERROR", loc: t.loc };
    }
}

const UnitAliases = {
    ton: "t", tons: "t", tonne: "t", tonnes: "t",
    days: "day", weeks: "week", months: "month", years: "year",
    second: "s", seconds: "s", minute: "min", minutes: "min", hour: "h", hours: "h",
}

const SubUnits = {
    ml: "l", cl: "l", dl: "l", dal: "l", hl: "l", kl: "l",
    mm: "m", cm: "m", dm: "m", dam: "m", hm: "m", km: "m",
    mg: "g", cg: "g", dg: "g", dag: "g", hg: "g", kg: "g", t: "g",
    min: "s", h: "s", day: "s", week: "s", month: "s", year: "s",
}

const ConversionFactors = {
    l: { ml: 1000, cl: 100, dl: 10, dal: 0.1, hl: 0.01, kl: 0.001 },
    m: { mm: 1000, cm: 100, dm: 10, dam: 0.1, hm: 0.01, km: 0.001 },
    g: { mg: 1000, cg: 100, dg: 10, dag: 0.1, hg: 0.01, kg: 0.001, t: 0.00001 },
    s: { min: 1/60, h: 1/60/60, day: 1/60/60/24, week: 1/60/60/24/7, month: 1/60/60/24/30, year: 1/60/60/24/365 },
}

function parse_unit(context) {
    let unit = context.expect(TokenIdentifier);
    unit.val = UnitAliases[unit.val] ?? unit.val;
    if (!ConversionFactors[unit.val] && !SubUnits[unit.val])
        error(`Unknown unit ${unit.val}`);
    return unit;
}

const Variables = {};

function update_info() {
    document.getElementById("info").innerHTML =
        "<table>" + Object.keys(Variables).map(
            name => `<tr><td><var>${name}</var></td><td>${render_evaluated(Variables[name])}</td></tr>`
        ).join("") + "</table>";
}

function evaluate(exp) {
    switch (exp.type) {
        case TokenAns: return last_answer;
        case TokenIdentifier: {
            let x = Variables[exp.val];
            if (x == undefined)
                error(`Undefined variable ${exp.val}`);
            return x;
        }
        case "vector": return exp.list.map(evaluate);
        case TokenNumber: return exp.val;
        case TokenPi: return Math.PI;
        case TokenE: return Math.E;
        case TokenRange: return { type: TokenRange, start_excl: exp.start_excl, end_excl: exp.end_excl, start: evaluate(exp.start), end: evaluate(exp.end) };
        case TokenRandom: {
            let range = evaluate(exp.range);
            const min = range.start ?? 0;
            if (range.type == TokenRange)
                range = range.end - range.start;
            return min + Math.random() * range;
        }
        case TokenConvert: {
            let val = evaluate(exp.operand);
            let from = exp.from.val;
            const sub = SubUnits[from];
            if (sub) {
                val /= ConversionFactors[sub][from];
                from = sub;
            }
            const to = exp.to.val;
            if (from != to) {
                const factor = ConversionFactors[from][to];
                if (!factor)
                    error(`Can't convert from ${from} to ${to}`);
                val *= factor;
            }
            return val;
        }
        case TokenLet: {
            const val = evaluate(exp.val);
            if (exp.in_exp) {
                const tmp = Variables[exp.id.val];
                Variables[exp.id.val] = val;
                const in_exp = evaluate(exp.in_exp);
                if (tmp == undefined)
                    delete Variables[exp.id.val];
                else Variables[exp.id.val] = tmp;
                return in_exp;
            }
            Variables[exp.id.val] = val;
            update_info();
            return val;
        }
        case "unop": switch (exp.op) {
            case UnOpNeg: return -evaluate(exp.operand);
            case UnOpNot: return !evaluate(exp.operand);
            case UnOpAbs: return Math.abs(evaluate(exp.operand));
            case UnOpSin: return Math.sin(evaluate(exp.operand));
            case UnOpCos: return Math.cos(evaluate(exp.operand));
            case UnOpTan: return Math.tan(evaluate(exp.operand));
            case UnOpFloor: return Math.floor(evaluate(exp.operand));
            case UnOpCeil: return Math.ceil(evaluate(exp.operand));
            case UnOpRound: return Math.round(evaluate(exp.operand));
            case UnOpTrunc: return Math.trunc(evaluate(exp.operand));
            case UnOpFract:
                let x = evaluate(exp.operand);
                return x - Math.trunc(x);
            case UnOpExp: return Math.exp(evaluate(exp.operand));
            case UnOpLn: return Math.log(evaluate(exp.operand));
        }
        case "biop": switch (exp.op) {
            case BiOpPlus: return evaluate(exp.left) + evaluate(exp.right);
            case BiOpMinus: return evaluate(exp.left) - evaluate(exp.right);
            case BiOpMul: return evaluate(exp.left) * evaluate(exp.right);
            case BiOpDiv: return evaluate(exp.left) / evaluate(exp.right);
            case BiOpPow: return Math.pow(evaluate(exp.left), evaluate(exp.right));
            case BiOpEq: return evaluate(exp.left) == evaluate(exp.right);
            case BiOpMore: return evaluate(exp.left) > evaluate(exp.right);
            case BiOpLess: return evaluate(exp.left) < evaluate(exp.right);
            case BiOpAnd: return evaluate(exp.left) && evaluate(exp.right);
            case BiOpOr: return evaluate(exp.left) || evaluate(exp.right);
            case BiOpLog: return Math.log(evaluate(exp.right)) / Math.log(evaluate(exp.left));
        }
    }
}

function render_evaluated(val) {
    if (val[0] != undefined)
        return "(" + val.map(render_evaluated).join(", ") + ")";
    if (typeof val == "number")
        return `<span class=token-num>${val}</span>`;
    if (val.type === TokenRange)
        return "<span class=token-kw>range</span> " +
            (val.start_excl ? "(" : "[") +
            render_evaluated(val.start) + ", " + render_evaluated(val.end) +
            (val.end_excl ? ")" : "]");
    return val;
}

function render_exp(exp, extra) {
    switch (exp.type) {
        case TokenAns: return "<span class=token-kw>ans</span>"
        case "vector": return "(" + exp.list.map(render_exp).join(", ") + ")";
        case TokenNumber: return `<span class=token-num>${exp.val}</span>`;
        case TokenPi: return "<span class=token-num>π</span>";
        case TokenE: return "<span class=token-num>e</span>";
        case TokenIdentifier: return `<span class=token-id>${exp.val}</span>`;
        case TokenRange: return "<span class=token-kw>range</span> " +
            (exp.start_excl ? "(" : "[") +
            render_exp(exp.start) + ", " + render_exp(exp.end) +
            (exp.end_excl ? ")" : "]");
        case TokenRandom: return "<span class=token-kw>random in</span> " + render_exp(exp.range);
        case TokenConvert: return "<span class=token-kw>convert</span> " + render_exp(exp.operand) + " " +
            `<span class=token-num>${exp.from.val}</span> <span class=token-kw>to</span> <span class=token-num>${exp.to.val}</span>`;
        case TokenLet:
            let x = `<span class=token-kw>let</span> <span class=token-id>${exp.id.val}</span> = ${render_exp(exp.val)}`;
            x = exp.in_exp ? x + " <span class=token-kw>in</span> " + render_exp(exp.in_exp) : x;
            if (extra?.left_operand)
                x = `(${x})`;
            return x;
        case "unop": {
            const p = { parent_precedence: 99 };
            switch (exp.op) {
                case UnOpNeg: return "<span class=token-op>-</span>" + render_exp(exp.operand, p);
                case UnOpNot: return "<span class=token-op>not</span> " + render_exp(exp.operand, p);
                case UnOpAbs: return "<span class=token-op>abs</span> " + render_exp(exp.operand, p);
                case UnOpSin: return "<span class=token-op>sin</span> " + render_exp(exp.operand, p);
                case UnOpCos: return "<span class=token-op>cos</span> " + render_exp(exp.operand, p);
                case UnOpTan: return "<span class=token-op>tan</span> " + render_exp(exp.operand, p);
                case UnOpFloor: return "<span class=token-op>floor</span> " + render_exp(exp.operand, p);
                case UnOpCeil: return "<span class=token-op>ceil</span> " + render_exp(exp.operand, p);
                case UnOpRound: return "<span class=token-op>round</span> " + render_exp(exp.operand, p);
                case UnOpTrunc: return "<span class=token-op>trunc</span> " + render_exp(exp.operand, p);
                case UnOpFract: return "<span class=token-op>fract</span> " + render_exp(exp.operand, p);
                case UnOpExp: return "<span class=token-op>exp</span> " + render_exp(exp.operand, p);
                case UnOpLn: return "<span class=token-op>ln</span> " + render_exp(exp.operand, p);
            }
        }
        case "biop": {
            const p = { parent_precedence: exp.op.precedence, left_operand: true };
            const pr = { parent_precedence: exp.op.precedence, right_operand: true };
            let r;
            switch (exp.op) {
                case BiOpPlus: r = render_exp(exp.left, p) + " <span class=token-op>+</span> " + render_exp(exp.right, pr); break;
                case BiOpMinus: r = render_exp(exp.left, p) + " <span class=token-op>-</span> " + render_exp(exp.right, pr); break;
                case BiOpMul: r = render_exp(exp.left, p) + " <span class=token-op>*</span> " + render_exp(exp.right, pr); break;
                case BiOpDiv: r = render_exp(exp.left, p) + " <span class=token-op>/</span> " + render_exp(exp.right, pr); break;
                case BiOpPow:
                    if (exp.right.val == 0.5)
                        return "<span class=token-op>sqrt</span> " + render_exp(exp.left, p);
                    r = render_exp(exp.left, p) + " <span class=token-op>^</span> " + render_exp(exp.right, pr);
                    break;
                case BiOpEq: r = render_exp(exp.left, p) + " <span class=token-op>equals</span> " + render_exp(exp.right, pr); break;
                case BiOpMore: r = render_exp(exp.left, p) + " <span class=token-op>></span> " + render_exp(exp.right, pr); break;
                case BiOpLess: r = render_exp(exp.left, p) + " <span class=token-op><</span> " + render_exp(exp.right, pr); break;
                case BiOpAnd: r = render_exp(exp.left, p) + " <span class=token-op>and</span> " + render_exp(exp.right, pr); break;
                case BiOpOr: r = render_exp(exp.left, p) + " <span class=token-op>or</span> " + render_exp(exp.right, pr); break;
                case BiOpLog:
                    let base = render_exp(exp.left, p);
                    if (exp.left.type != TokenNumber)
                        base = " " + base;
                    r = "<span class=token-op>log</span>" + base + " " + render_exp(exp.right, pr);
                    break;
            }
            if (extra)
                if (extra.parent_precedence > p.parent_precedence || extra.right_operand && extra.parent_precedence == p.parent_precedence)
                    r = `(${r})`;
            return r;
        }
        default: return "ERROR: Undefined Operation";
    }
}