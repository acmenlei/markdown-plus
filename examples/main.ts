// import { markdownToHTML } from "../index"
import { markdownToHTML } from "../"
import "../lib/styles/dark.css";

const md = `
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
### TS代码高亮
\`\`\`ts
const falses: boolean = false;
const trues = true;
\`\`\`
`;

(document.querySelector("#app") as Element).innerHTML = markdownToHTML(md);
