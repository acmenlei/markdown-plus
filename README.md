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
Markdown converter, convert Markdwon content to HTML format, and provide code line number display and code highlighting effect (currently support javascript, HTML and other languages, later will support C, C++, Java, JS, TS, Ruby, Rust, PHP, GO, ...).

[The online demo](https://acmenlei.github.io/markdown-transform-html-demo/dist/)

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
markdownToHTML(markdownContent, { highlight: true });
```

# options
Configure the markdownToHTML options
| property name        | type    | default value | meaning |
| -------------------- | ------- | ------------- | ------- |
| lineNumber      | Boolean  | false | If you need line numbers, turn this option on |
| highlight      | Boolean  | false          | If you need to highlight code in markdown, turn this option on |
| xss      | Boolean  | true          | To prevent users from xss attacks on your application, xss is used by default. If you want to turn it off, you can set it to false |

## Sponsorship

If you think this project is helpful to you and circumstances permit, you can give me a little support. In short, thank you very much for your support ~

<div style="display: flex; gap: 20px;" >
<div style="text-align: center">
<p>WeChat</p>
<img style="width: 165px; height: 165px" src="./docs/wechat.jpg "alt=" wechat" />
</div>
<div style="text-align: center">
<p>Alipay</p>
<img style="width: 165px; height: 165px" src="./docs/alipay.jpg "alt=" alipay" />
</div>
</div>

## License

MIT © [coderlei](./license)
