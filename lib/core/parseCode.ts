import { ITransformOptions, TemplateList } from "./parseToHTML";
// import Prism from "prismjs";
// import "prismjs/themes/prism-tomorrow.min.css";
// import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
// import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
// import "prismjs/plugins/toolbar/prism-toolbar.min.js";
// import "prismjs/plugins/toolbar/prism-toolbar.min.css";
// import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js";
// import "prismjs/plugins/show-language/prism-show-language.min.js";

// // 解析的语言 预设...
// import "prismjs/components/prism-java.min.js";
// import "prismjs/components/prism-css.min.js";
// import "prismjs/components/prism-dart.min.js";
// import "prismjs/components/prism-go.min.js";
// import "prismjs/components/prism-http.min.js";
// import "prismjs/components/prism-json.min.js";
// import "prismjs/components/prism-kotlin.min.js";
// import "prismjs/components/prism-scss.min.js";
// import "prismjs/components/prism-python.min.js";
// import "prismjs/components/prism-ruby.min.js";
// import "prismjs/components/prism-rust.min.js";
// import "prismjs/components/prism-swift.min.js";
// import "prismjs/components/prism-sql.min.js";
// import "prismjs/components/prism-typescript.min.js";
// import "prismjs/components/prism-c.min.js";
// import "prismjs/components/prism-cpp.min.js";
/**
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
  // result = `<pre><code ${classes && `class='${classes}'`}>${Prism.highlight(
  //   result,
  //   Prism.languages[language],
  //   language
  // )}</code></pre>`;
  result = `<pre><code ${classes && `class='${classes}'`}>${result}</code></pre>`;
  return { startIdx: i, result };
}

// export const reHighlight = Prism.highlightAll;
