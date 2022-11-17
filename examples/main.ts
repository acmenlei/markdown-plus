import { markdownToHTML } from "../"
import md1 from "./__test__/test1"
import "../lib/styles/index.css";
import "../lib/highlight/light.css"
import "./styles/operation.css"


const content = markdownToHTML(md1, { highlight: true, lineNumber: true });

(document.querySelector("#app") as Element).innerHTML = content;

// window.print()
