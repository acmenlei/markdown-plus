// import { markdownToHTML } from "../index"
import { markdownToHTML } from "../"
import "markdown-transform-html/lib/styles/index.css";

const md = `
\`\`\`js
function fileChange() {
  let fd = new FormData();
  fd.append('file', (file.value as any).files[0])
  fd.append('filename', (file.value as any).files[0].name)
	// 上传接口
  uploadSingleFile(fd).then(res => {
    console.log(res)
  })
}
\`\`\`
`;

(document.querySelector("#app") as Element).innerHTML = markdownToHTML(md);
