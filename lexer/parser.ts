import {lexer, Lexer} from "./lexer";
import {head, Stream, tails,} from "./stream";
import {
    ClosingChevron,
    Comma,
    Def,
    EOF,
    LPar,
    OpeningChevron,
    Quote,
    RPar,
    SemiColon,
    Slash,
    Style,
    Token,
} from "./token";


function isNumeric(str: string) {
    return !isNaN(+str) &&
        !isNaN(parseFloat(str))
}

export class SLexer {
    static l: Lexer;

    static init(input: Stream): void {
        SLexer.l = lexer(tails(input), head(input));
    }

    static getToken(): Token {
        try {
            return SLexer.l.getToken();
        } catch (e) {
            return new EOF();
        }
    }
}

export class Extract {
    static parse(tok: Token) {
        const l = [];

        while (!(tok instanceof EOF)) {
            if (tok instanceof OpeningChevron) {
                l.push(Balise.parse(tok));
            }
            tok = SLexer.getToken();
        }

        return l;
    }
}

export class Balise {
    static parse(tok: Token) {
        let content: StyleObject | null = null;
        if (tok instanceof OpeningChevron) {
            tok = SLexer.getToken();
            if (tok instanceof Slash) return content; //closing balise
            while (!(tok instanceof EOF) && !(tok instanceof ClosingChevron)) {
                if (tok instanceof Style && SLexer.getToken() instanceof Def) {
                    SLexer.getToken(); //lpar
                    content = (StyleObject.parse(SLexer.getToken()));
                }
                tok = SLexer.getToken();
            }
        }
        return content;
    }
}

export class StyleObject {
    constructor(private keys: Array<string>, private values: Array<string>) {
    }

    getKeys(): Array<string> {
        return this.keys;
    }

    getValues(): Array<string> {
        return this.values;
    }

    static parse(t: Token): StyleObject {
        const values: Array<string> = [];
        const keys: Array<string> = [];
        if (t instanceof LPar) {
            do {
                t = SLexer.getToken();
                keys.push(t.toString());
                t = SLexer.getToken();
                if (t instanceof RPar) {
                    return new StyleObject([], []);// empty object
                }
                if (!(t instanceof SemiColon)) {
                    throw new Error("missing semicolon");
                }
                t = SLexer.getToken();
                if (t instanceof Quote) {
                    t = SLexer.getToken();
                    values.push(t.toString());
                    t = SLexer.getToken();
                } else {
                    if (isNumeric(t.toString())) {
                        values.push(t.toString() + "px");
                    }
                    else {
                        values.push(t.toString());
                    }
                }
                t = SLexer.getToken();
            } while (t instanceof Comma);
            if (!(t instanceof RPar)) {
                throw new Error("Missing }");
            }
            t = SLexer.getToken();
            if (!(t instanceof RPar)) {
                throw new Error("Missing }");
            }
        }
        return new StyleObject(keys, values);
    }
}

