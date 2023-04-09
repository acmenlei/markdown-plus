import { ITransformOptions, TemplateList } from "./parseToHTML";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
/**
 * 这里暂时只处理了脚本和html，后续会考虑继续增加。。(除了标记语言，所有语言都是统一进行处理的)
 * @param templates md切割后的模版
 * @param i 当前开始处理位置
 * @param templateLength 模板的总长度
 * @returns 解析后的带语法高亮的代码块
 */
export function parseCode(
  templates: TemplateList,
  i: number,
  templateLength: number,
  options: ITransformOptions
) {
  let result = "",
    language = templates[i].slice(3).trim().toLowerCase();
  ++i;
  while (i < templateLength && !templates[i].startsWith("```")) {
    result += templates[i] + "\n";
    i++;
  }
  // 以防下次进入, 结束标志
  templates[i] = "";
  const highlight = options.highlight ? `language-${language}` : "",
    lineNumber = options.lineNumber ? "line-numbers" : "",
    classes = [highlight, lineNumber].join(" ");

  result = `<pre><code ${classes && `class='${classes}'`}>${Prism.highlight(
    result,
    Prism.languages[language],
    language
  )}</code></pre>`;
  return { startIdx: i, result };
}

export const reHighlight = Prism.highlightAll;
