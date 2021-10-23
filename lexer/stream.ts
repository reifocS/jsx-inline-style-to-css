export type Stream = "" | [string, Stream];

export const EMPTY = "";

export function isEmpty(s: Stream): s is "" {
    return s === "";
}

export function filtrage<R>(
    l: Stream,
    casVide: () => R,
    casCons: (t: string, r: Stream) => R
): R {
    if (isEmpty(l)) {
        return casVide();
    } else {
        return casCons(l[0], l[1]);
    }
}

export function printStream(s: Stream): string {
    return filtrage(
        s,
        () => "",
        (t, r) => t + printStream(r)
    );
}

export function head(s: Stream): string {
    if (isEmpty(s)) {
        throw new Error("Empty stream");
    }
    return s[0];
}

export function tails(s: Stream): Stream {
    if (isEmpty(s)) {
        throw new Error("Empty stream");
    }
    return s[1];
}

export function stringAsStream(string: string): Stream {
    let s: Stream = EMPTY;
    for (let i = string.length - 1; i >= 0; i--) {
        s = [string[i], s];
    }
    return s;
}
