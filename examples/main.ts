// import { markdownToHTML } from "../index"
import { markdownToHTML } from "../"
import "../lib/styles/dark.css";

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
import name from "static/name.txt"
let a = true;

// 语法分析
while (l--) {
  last = st.lastIndexOf("(");
  res = "(" + processParcel1(st.slice(last + 1).join(""), false) + res;
  st = st.slice(0, last);
}

export default class Alice20 extends Person{
  let name;
  let sex = '';
  let age;
  constructor(): number {
    this.name='alice';
    this.age = 20;
    this.sex = '女';
  }
}
(document.querySelector("#app") as Element).innerHTML = markdownToHTML(md);
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
      port: 8090,
      host: '0.0.0.0',
      https: false,
      open: true /* comments false */
  },
  // 其他配置
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
`;

(document.querySelector("#app") as Element).innerHTML = markdownToHTML(md);
