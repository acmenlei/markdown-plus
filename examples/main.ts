// import { markdownToHTML } from "../index"
import { markdownToHTML } from "../"
import "../lib/styles/dark.css";

const md = `
\`\`\`ts
// 引入前
import { ref, computed } from 'vue'
const count = ref(0)
const doubled = computed(() => <span>{count.value * 2 }</span>)

//引入后
const count = ref(0)
const doubled = computed(() => count.value * 3)


// 引入前
import { useState } from 'react'
export function Counter() {
  const [count, setCount] = useState(0)
  return <div>{ count }</div>
}

//引入后
export function Counter() {
  const [count, setCount] = useState(0)
  return <div>{ count }</div>
}
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
