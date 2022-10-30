import { markdownToHTML } from "../"
import "../lib/styles/index.css";
import "./styles/index.css"

import md1 from "./__test__/test1"

const content = markdownToHTML(md1, { highlight: true, lineNumber: true });

(document.querySelector("#app") as Element).innerHTML = content;

// const options: htmlPdf.CreateOptions = {
//   port: 9222, // port Chrome is listening on
// };


// const pdf = await htmlPdf.create(content, options);

// pdf.toFile("coderlei-resume.pdf")

// window.print()
