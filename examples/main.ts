import { markdownToHTML } from "../"
import "../lib/styles/index.css";
import "../lib/highlight/dark.css"

const code = `
## 我是标题
耳机标题文章
### 我是三级标题
![图片](wwww.baid.com)
> 看一下
\`\`\`js
const name = 'coderlei';
new Promsie((resolve, reject) => {
    resolve("success");
    console.log("（成功了")
})
\`\`\`
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

(document.querySelector("#app") as Element).innerHTML = markdownToHTML(code, { highlight: true, lineNumber: true });
