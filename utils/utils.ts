let id = 0;


export const getUniqueId = () => {
    return id++;
}

export const zip = (rows: Array<Array<any>>) => rows[0].map((_, c) => rows.map(row => row[c]));

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
