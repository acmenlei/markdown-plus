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
<script setup lang="ts">
import { ref } from "vue"

const falses: Ref<boolean> = ref(false);
const trues = true;
</script>

<template>
<div>
{{ dsad }}
</div>
</template>

<style>
.a {
    content: stirng;
}
</style>
\`\`\`
`;

(document.querySelector("#app") as Element).innerHTML = markdownToHTML(md);
