import { markdownToHTML } from "../"
import md1 from "./__test__/test1"
import md3 from "./__test__/test3"
import "./styles/design.scss"


const content = markdownToHTML(md3);

(document.querySelector("#app") as Element).innerHTML = content;

// window.print()
