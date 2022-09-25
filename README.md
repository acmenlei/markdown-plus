<div align="center">
	<h2>markdown-to-html</h2>
	<p align="center">
	    <a href="https://github.com/Acmenlei/markdown-to-html/tree/master" target="_blank">
	        <img src="https://img.shields.io/badge/markdown--to--html-1.1-orange" alt="markdown-to-html">
	    </a>
		<a href="https://www.tslang.cn/" target="_blank">
	        <img src="https://img.shields.io/badge/typescript-%3E4.0.0-blue" alt="typescript">
	    </a>
	</p>
	<p>&nbsp;</p>
</div>

# 介绍
一款markdown转换器，将markdwon内容转换为html格式，并提供代码行号显示以及代码高亮效果（支持javascript,html,java,c等语言），如果不喜欢本样式，也可以使用highlightjs进行高亮显示，扩展性强。

# 效果
### JavaScript语法高亮
- TODO: 对常规语法高亮，复杂语法暂时未处理

![代码高亮](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f56b11e22f14013985ebcc84a0bd070~tplv-k3u1fbpfcp-watermark.image?)
### HTML语法高亮
![HTML解析](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c2e8256b7c445cb8a1786aca55047f7~tplv-k3u1fbpfcp-watermark.image?)
### 其他语法
其他语法可以自己尝试...
# 使用
- 安装
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
- 引入
```ts
import { markdownToHTML } from "markdown-transform-html"
import  "markdown-transform-html/lib/styles/index.css";
```
- 调用
`markdownToHTML`方法接收一个markdown文本，返回一个处理好的`HTML`内容，**引入样式**之后自动处理代码高亮以及行号显示。
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
`
const html = markdownToHTML(document.querySelector("textarea")?.value as string || md);
(document.querySelector("#app") as Element).innerHTML = html;
```
# 结尾
详情的使用请查看`examples`文件夹下的案例，有任何建议欢迎提出来，欢迎给仓库贡献代码～