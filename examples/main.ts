import { markdownToHTML } from "../index"
import  "../lib/styles/index.css";
// import 

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

\`\`\`js
// 注释节点
# dsad
/*
 * dsadsasdasdsa
 * dsadsasdas
*/
let text = new name();
long long dsd = dsa;
function *foo (name,parser) {
  console.log(text)
}

class Person implements dsadas extends sname {
  constructor() {

  }
  void name() {

  }
}

import { name } from "../dsads";

\`\`\`
\`\`\`js
new Promise().then()
function foo(string name, int age) {
  console.log(text, name, age)
}

export default {
  name: "dsasds",
  age: 18
}

const bbb = "2000";
\`\`\`
> 这是一条注释dsadsadsad

\`\`\`html
<text id="name" age="18">我是html</text>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- <button>dsads</button> -->
  <div id="app"></div>
  <div>
    <div>
      <div>
      content...
      </div>
    </div>
  </div>
  
      <h2>我是标题</h2>
  <script type="module" src="main.ts"></script>
  <component   />
</body>
</html>
<script>
interface AppConfig {
  errorHandler?: (
    err: unknown,
    instance: ComponentPublicInstance | null,
    // \`info\` 是一个 Vue 特定的错误信息
    // 例如：错误是在哪个生命周期的钩子上抛出的
    info: string
  ) => void
}


export default {
  name: 'xlx',
  age: 23,
  sex: '男'
}


import { createApp } from 'vue'
import MyPlugin from './plugins/MyPlugin'

const app = createApp({
  /* ... */
})

app.use(MyPlugin)
interface App {
  mount(rootContainer: Element | string): ComponentPublicInstance
}

function name() {
  window.addEventListener("click" , (test, name) => {
    console.log("over")
  })
  window.addEventListener("click" , function (test, name) {
    console.log("over")
  })

  int name = 11;

  fs.read('path', function (err) {
    console.log(err)
  })
}
</script>
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

| property name | type             | default value | meaning\|                                                    |
| ------------- | ---------------- | ------------- | ------------------------------------------------------------ |
| body          | String           | 必须传递      | 需要解析的HTML容器，请传递 class 或 id                       |
| width         | String ｜ Number | 必须传递      | 设置整个VueMarkdownMenuBar容器的宽度，可以为百分比，也可为数值 |

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