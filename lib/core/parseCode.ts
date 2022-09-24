import { TemplateList } from "./parseToHTML";

export function processCodePre(templates: TemplateList, i: number, templateLength: number) {
  let result = '', language = templates[i].slice(3).trim(), line = 1;
  ++i;
  while (i < templateLength && !templates[i].startsWith("```")) {
    result += processSyntaxAndLineNumber(templates[i], line++);
    i++;
  }
  // 以防下次 endTag
  templates[i] = '';
  return { startIdx: i, result: `<pre language=${language}>${result}</pre>` };
}

export function processLineCode(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("`")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = text.indexOf("`");
    result += `<code>${text.slice(0, lastIdx)}</code>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result
}

// TODO: 词法分析暂时先这么写 后续补充。。
function processSyntaxAndLineNumber(syntax: string, line: number) {
  return `<p><span class='line-number'>${line}</span><code>${syntax}</code></p>`
}