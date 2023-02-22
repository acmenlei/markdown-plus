import { markdownToHTML } from "../"
import md1 from "./__test__/test1"
import md3 from "./__test__/test3"
import "./styles/operation.css"

const content = markdownToHTML(md1);

(document.querySelector("#app") as Element).innerHTML = content;

// window.print()
