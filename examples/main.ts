import { markdownToHTML } from "../"
import "../lib/styles/index.css";
import "../lib/highlight/dark.css"

const code = `
<div align="center">
	<h3>markdown-transform-html</h3>
	<p align="center">
		<a href="https://github.com/Acmenlei/markdown-to-html/tree/master" target="_blank"><img src="https://img.shields.io/badge/markdown--transform--html-%3E1.3-ff69b4" alt="markdown-transform-html"></a>
		<a href="https://www.tslang.cn/" target="_blank"> <img src="https://img.shields.io/badge/typescript-%3E4.0.0-blue" alt="typescript"></a>
	</p>
	<p>&nbsp;</p>
</div>

# introduce
Markdown converter, convert Markdwon content to HTML format, and provide code line number display and code highlighting effect (currently support javascript, HTML and other languages, later will support C, Java, C++, GO, etc.).
[The online demo](https://acmenlei.github.io/markdown-transform-html-demo/)

# prompt
To make the style apply only to the part that needs to be parsed, be sure to add a 'markdown-transform-html' class declaration to the parsed container.
# use
## install
\`\`\`js
pnpm install markdown-transform-html
\`\`\`
or
\`\`\`js
npm install markdown-transform-html
\`\`\`
or
\`\`\`js
yarn add markdown-transform-html
\`\`\`
## the basic use
\`\`\`ts
import { markdownToHTML } from "markdown-transform-html"
import  "markdown-transform-html/lib/styles/index.css";

const markdownContent = \`#### level 4\`;
const html = markdownToHTML(markdownContent);
(document.querySelector("#app") as Element).innerHTML = html;
\`\`\`
## code highlighting
If you want to highlight code, then you need to introduce the following css styles and configure options, which is optional.

\`\`\`ts
import "markdown-transform-html/lib/highlight/dark.css";
// import "markdown-transform-html/lib/highlight/light.css";

markdownToHTML(markdownContent, { highlight: true });
\`\`\`

# options
Configure the markdownToHTML options
| property name        | type    | default value | meaning |
| -------------------- | ------- | ------------- | ------- |
| lineNumber      | Boolean  | false | If you need line numbers, turn this option on |
| highlight      | Boolean  | false          | If you need to highlight code in markdown, turn this option on |

# end
For more details, please see the examples in the 'examples' folder. Any suggestions are welcome, and you are welcome to contribute code ~ to the warehouse
`;

(document.querySelector("#app") as Element).innerHTML = markdownToHTML(code, { highlight: true, lineNumber: true });
