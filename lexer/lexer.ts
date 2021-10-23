import {head, isEmpty, Stream, tails,} from "./stream";
import {
    ClosingChevron,
    Comma,
    Def,
    EOF,
    Identifier,
    LPar,
    OpeningChevron,
    Quote,
    RPar,
    SemiColon,
    Slash,
    Style,
    Token,
} from "./token";

export interface Lexer {
    next(): void;
    lex(): Array<Token>;
    getToken(): Token;
}

export function lexer(stream: Stream, current: string): Lexer {
    return new (class implements Lexer {
        next(): void {
            if (!isEmpty(stream)) {
                current = head(stream);
                stream = tails(stream);
            } else {
                current = "";
            }
        }

        lex(): Array<Token> {
            const tokens = [];
            try {
                let tok = this.getToken();
                while (!(tok instanceof EOF)) {
                    tokens.push(tok);
                    tok = this.getToken();
                }
            } catch (e) {
            }
            return tokens
        }
        getToken(): Token {
            switch (current) {
                case "":
                    return new EOF();
                case "<":
                    this.next();
                    return new OpeningChevron();
                case ">":
                    this.next();
                    return new ClosingChevron();
                case "/":
                    this.next();
                    return new Slash();
                case " ":
                case "\n":
                    this.next();
                    return this.getToken();
                case "=":
                    this.next();
                    return new Def();
                case ":":
                    this.next();
                    return new SemiColon();
                case ",":
                    this.next();
                    return new Comma();
                case "{":
                    this.next();
                    return new LPar();
                case "}":
                    this.next();
                    return new RPar();
                case '"':
                case "'":
                    this.next();
                    return new Quote();
                default:
                    let id = current;
                    this.next();
                    while (this.isAlphaNumeric(current)) {
                        id += current;
                        this.next();
                    }
                    if (id === "style") {
                        return new Style("");
                    }
                    return new Identifier(id);
            }
        }

        isAlphaNumeric(char: string): boolean {
            const letterNumber = /^[0-9a-zA-Z%]+$/;
            return char.match(letterNumber) !== null;
        }
    })();
}

