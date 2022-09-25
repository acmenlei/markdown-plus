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
function foo (name,parser) {
  console.log.log.log(text)
}

class Person {
  constructor() {

  }
  void name() {

  }
}
\`\`\`
\`\`\`js
new Promise().then()
function foo(string name, int age) {
  console.log(text)
}
\`\`\`
> 这是一条注释dsadsadsad

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

`
const html = markdownToHTML(document.querySelector("textarea")?.value as string || md);
(document.querySelector("#app") as Element).innerHTML = html;