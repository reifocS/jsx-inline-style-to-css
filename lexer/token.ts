export interface Token {}

export class EOF implements Token {
    toString(): string {
        return "";
    }
}

export class OpeningChevron implements Token {
    toString(): string {
        return "<";
    }
}

export class ClosingChevron implements Token {
    toString(): string {
        return ">";
    }
}

export class Style implements Token {
    constructor(private value: Token) {}
    toString(): string {
        return "--" + this.value + "--";
    }
}

export class Identifier implements Token {
    constructor(private value: string) {}
    toString(): string {
        return this.value;
    }
}

export class Def implements Token {
    toString(): string {
        return "=";
    }
}

export class LPar implements Token {
    toString(): string {
        return "{";
    }
}

export class RPar implements Token {
    toString(): string {
        return "}";
    }
}

export class SemiColon implements Token {
    toString(): string {
        return ";";
    }
}

export class Comma implements Token {
    toString(): string {
        return ",";
    }
}

export class Quote implements Token {
    toString(): string {
        return "''";
    }
}


export class Slash implements Token {
    toString(): string {
        return "\/";
    }
}