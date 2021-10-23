import type {NextPage} from 'next'
import Head from 'next/head'
import React, {useState} from "react";
import {Extract, SLexer} from "../lexer/parser";
import {stringAsStream} from "../lexer/stream";
import {camelToSnakeCase, getUniqueId, zip} from "../utils/utils";

const example = `<div style={{display: "flex", gap : 10}}>
      <h1 style={{color: "red"}}>Hello Style!</h1>
      <p>style is important</p>
      <p>Add a little style!</p>
      <span style={{float:'right'}}>Download Audit</span>
</div>`

const style = `.classname-0 {
    display: flex;
    gap: 10px;
}
.classname-1 {
    color: red;
}
.classname-2 {
    float: right;
}`


const Home: NextPage = () => {
    const [toExtract, setToExtract] = useState(example);
    const [cssExtracted, setCss] = useState(style);

    const extractCss = () => {
        SLexer.init(stringAsStream(toExtract));
        const l = Extract.parse(SLexer.getToken());
        const res = l.filter((t) => t);
        let css = res.reduce(((previousValue, current) => {
            if (!current) return previousValue;
            const values = current.getValues();
            const keys = current.getKeys();
            const z = zip([keys, values]);
            const c = z.reduce((prev, curr) => {
                const [k, v] = curr;
                return `${prev}    ${camelToSnakeCase(k)}: ${v};\n`
            }, "")
            return `${previousValue}.classname-${getUniqueId()} {\n${c}}\n`
        }), "")
        setCss(css)
    }
    return (
        <div>
            <Head>
                <title>JSX inline style to CSS</title>
                <meta name="description" content="Online editor to extract css classes from inline style in jsx"/>
            </Head>
            <div className="flex flex-center">
                <h1>Extract css classes from JSX</h1>
            </div>
            <div className="flex flex-center actions" style={{marginTop: 16}}>
                <button onClick={extractCss} disabled={!toExtract.trim()}>Extract css</button>
                <button onClick={async () => {
                    await navigator.clipboard.writeText(cssExtracted);
                }}>Copy to clipboard
                </button>
            </div>
            <main className="margin-constraint">
                <div className="extractor flex">
                    <div className="text-editor">
                        <div>
                            <b>JSX</b>
                            <textarea value={toExtract}
                                      className="text-editor__area"
                                      placeholder="paste your jsx here"
                                      rows={(30)}
                                      onChange={({target}) => setToExtract(target.value)}/>
                        </div>
                    </div>
                    <div className="extracted-css">
                        <div>
                            <div className="result">
                                <b>CSS</b>
                                <textarea readOnly value={cssExtracted} rows={30} className="css-area"/>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
