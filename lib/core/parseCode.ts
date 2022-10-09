import { isComments, isFile, isHTMLTag, isNeedEndChar, isNormalData } from "../../utils";
import Parser from "../languages";
import { TemplateList } from "./parseToHTML";
/**
 * 这里暂时只处理了脚本和html，后续会考虑继续增加。。(除了标记语言，所有语言都是统一进行处理的)
 * @param templates md切割后的模版
 * @param i 当前开始处理位置
 * @param templateLength 模板的总长度
 * @returns 解析后的带语法高亮的代码块
 */
export function parseCode(templates: TemplateList, i: number, templateLength: number) {
  // console.log(templates)
  let result = '', language = templates[i].slice(3).trim().toLowerCase(), line = 1;
  ++i;
  while (i < templateLength && !templates[i].startsWith("```")) {
    result += Parser[language](templates[i], line++);
    // result += isHTML ? parseHTMLSyntax(templates[i], line++) : processSyntaxHighlight(templates[i], line++);
    i++;
  }
  // 以防下次进入, 结束标志
  templates[i] = '';
  return { startIdx: i, result: `<pre language=${language}><code>${result}</code></pre>` };
}
// // 处理单行code
export function parseSingleLineCode(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("`")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = text.indexOf("`");
    result += `<code class=single-code>${text.slice(0, lastIdx)}</code>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result;
}