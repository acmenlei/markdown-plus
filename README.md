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


# introduction
Markdown converter, convert Markdwon content to HTML format, and provide code line number display and code highlighting effect (currently support javascript, HTML and other languages, later will support C, Java, C++, GO, etc.).

[The online demo](https://acmenlei.github.io/markdown-transform-html-demo/)

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
- the installation
```shell
pnpm install markdown-transform-html
` ` `
or
```shell
npm install markdown-transform-html
` ` `
or
```shell
yarn add markdown-transform-html
` ` `
- the introduction of
```ts
import { markdownToHTML } from "markdown-transform-html"
import  "markdown-transform-html/lib/styles/index.css";
` ` `
- call
The 'markdownToHTML' method receives a MarkDown text, returns a processed HTML content, and automatically handles code highlighting and line number display after the style is introduced.
```ts
const md = `
# 我是一级标题
## 我是二级标题
### 我是三级标题
#### 我是四级标题
##### 我是五级标题
###### 我是六级标题

- li1
- li2a
  - li2.1
    - li2.1.1
  - li2.2
- li3
- li4

我是最后的内容\`vuejs\`下面是\`reactjs\`
我是**加强的内容**\`dsadsadsads\`**dsadas**

- li10
- li11
  - li14

### javascript代码高亮
\`\`\`js
// 注释节点
# dsad
/*
 * 多行注释节点
 */
let text = new name();
function *foo (name,parser) {
  console.log(text)
}

class Person extends People {
  constructor() {
  }
}
new Promise().then(err => console.log(err))

export default {
  name: "coderlei",
  age: 18
}

\`\`\`

> 注释语句

### html代码高亮
\`\`\`html
<text id="name" age="18">我是html</text>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  <!-- <button>dsads</button> -->
  <div id="app"></div>
  <h2>我是标题</h2>
  <script type="module" src="main.ts"></script>
  <component   />
</body>
</html>
\`\`\`

![一朵花](https://img1.baidu.com/it/u=4260946381,835108024&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1664125200&t=22f4f6189388e98416c9f814dc3910ec)
[百度](www.baidu.com)
1. 标题1
2. 标题2
3. 标题3
  1.标题4
  2.标题5
    1.标题6
  3. 标题7
4. 标题8

### java代码高亮
\`\`\`java
BufferedWriter out = null;  
try {  
    out = new BufferedWriter(new FileWriter("filename", true));  
    out.write("aString");  
} catch (IOException e) {  
    // error processing code  
} finally {  
    if (out != null) {  
        out.close();  
    }  
}
\`\`\`

| property name | type             | default value | meaning                                            |
| ------------- | ---------------- | ------------- | ------------------------------------------------------------ |
| body          | String           | 测试文本      | 测试文本                     |
| width         | String ｜ Number | 测试文本      | 测试文本 |

\`*我是斜体*\` ** 我是加强后的文字**
`
const html = markdownToHTML(md);
(document.querySelector("#app") as Element).innerHTML = html;
```
# end
For more details, please see the examples in the 'examples' folder. Any suggestions are welcome, and you are welcome to contribute code ~ to the warehouse