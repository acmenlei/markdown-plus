<div align="center">
	<h3>markdown-transform-html</h3>
	<p align="center">
	    <a href="https://github.com/Acmenlei/markdown-to-html/tree/master" target="_blank">
	        <img src="https://img.shields.io/badge/markdown--transform--html-%3E1.3-ff69b4" alt="markdown-transform-html">
	    </a>
		<a href="https://www.tslang.cn/" target="_blank">
	        <img src="https://img.shields.io/badge/typescript-%3E4.0.0-blue" alt="typescript">
	    </a>
	</p>
	<p>&nbsp;</p>
</div>


# introduce
Markdown converter, convert Markdwon content to HTML format, and provide code line number display and code highlighting effect (currently support javascript, HTML and other languages, later will support C, Java, C++, GO, etc.).

[The online demo](https://acmenlei.github.io/markdown-transform-html-demo/dist/)

# effect
### JavaScript syntax highlighted
![script](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/855befde7c9e4dc09b8e52a07a15ab87~tplv-k3u1fbpfcp-watermark.image?)
### HTML syntax highlighted
![html](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c2e8256b7c445cb8a1786aca55047f7~tplv-k3u1fbpfcp-watermark.image?)
### Other syntax
Other grammars can be tried...
# prompt
To make the style apply only to the part that needs to be parsed, be sure to add a 'markdown-transform-html' class declaration to the parsed container.
# use
## install
```shell
pnpm install markdown-transform-html
```
or
```shell
npm install markdown-transform-html
```
or
```shell
yarn add markdown-transform-html
```
## the basic use
```ts
import { markdownToHTML } from "markdown-transform-html"
import  "markdown-transform-html/lib/styles/index.css";

const markdownContent = `#### level 4`;
const html = markdownToHTML(markdownContent);
(document.querySelector("#app") as Element).innerHTML = html;
```
## code highlighting
If you want to highlight code, then you need to introduce the following css styles and configure options, which is optional.

```ts
import "markdown-transform-html/lib/highlight/dark.css";
// import "markdown-transform-html/lib/highlight/light.css";

markdownToHTML(markdownContent, { highlight: true });
```

# options
Configure the markdownToHTML options
| property name        | type    | default value | meaning |
| -------------------- | ------- | ------------- | ------- |
| lineNumber      | Boolean  | false | If you need line numbers, turn this option on |
| highlight      | Boolean  | false          | If you need to highlight code in markdown, turn this option on |
| xss      | Boolean  | true          | To prevent users from xss attacks on your application, xss is used by default. If you want to turn it off, you can set it to false |

# end
For more details, please see the examples in the 'examples' folder. Any suggestions are welcome, and you are welcome to contribute code ~ to the warehouse