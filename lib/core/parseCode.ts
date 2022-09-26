import { isComments, isFile, isHTMLTag, isNeedEndChar, isNormalData } from "../../utils";
import { parseHTMLSyntax } from "../languages/html";
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
  let result = '', language = templates[i].slice(3).trim(), line = 1;
  ++i;
  let isHTML = language.toLowerCase() === 'html';
  while (i < templateLength && !templates[i].startsWith("```")) {
    result += isHTML ? parseHTMLSyntax(templates[i], line++) : processSyntaxHighlight(templates[i], line++);
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

export function processSyntaxHighlight(content: string, line: number) {
  let template = '';
  let s = content.split('\n');
  for (let i = 0; i < s.length; i++) {
    let sub = s[i];
    template += analysisOfGrammar(sub, line++)
  }
  return template;
}
// 语法分析
function analysisOfGrammar(s: string, line: number) {
  let st: string[] = [], tmpStr = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] == ")") {
      let cur: string | undefined = '';
      while (st.length && (cur = st.pop()) != '(') {
        tmpStr = cur + tmpStr;
      }
      if (cur != '(') {
        // 换行缺少开括号
        st.push(handlerJSStr(tmpStr + ')', false))
      } else {
        st.push(handlerJSStr(tmpStr, true))
      }
      tmpStr = '';
    } else {
      st.push(s[i]);
    }
  }
  return `<p><span class=line-number>${line}</span><span>${handlerJSStr(st.join(""), false)}</span></p>`
}

function handlerJSStr(inner: string, parcel: boolean) {
  if (!inner.trim()) {
    return parcel ? `(${inner})` : inner;
  }
  // 是否是注释
  if (isComments(inner.trim())) {
    return parseSingleComments(inner);
  }
  // 开始进行正常计算
  let result = inner;
  // 该语句是否已经处理过了，没处理过再处理
  if (!result.includes("declare-func")) {
    result = parseFuntion(inner);
  }
  if (!result.includes("declare-arrow-func")) {
    result = parseArrowFunction(result);
  }
  result = parseDeclareConstant(result);
  result = parseFuntionCall(result);
  result = parseFuntionExecute(result);
  result = parseClass(result);
  result = parseString(result);
  if (isNormalData(result)) {
    result = parsePropCall(result);
    result = parseNumber(result);
  }
  result = parseOperatorChar(result);
  result = parseAssignmentStatement(result);
  result = parseNormalData(result);
  result = parseSpecComents(result);
  return parcel ? `(${result})` : result;
}

function parseFuntion(content: string) {
  return content.replace(/function/g, ($) => `<span class=declare-function>${$}</span>`)
}
function parseArrowFunction(content: string) {
  if (!content.includes("=>")) {
    return content;
  }
  return content.replace(/=>/g, ($) => `<span class=declare-arrow-func>${$}</span>`)
}
function parseString(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("\"")) != -1 || (idx = text.indexOf("\'")) != -1) {
    let even = false;
    text.indexOf("\"") != -1 ? even = true : {};
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = even ? text.indexOf("\"") : text.indexOf("\'");
    result += `<q class=declare-string>${text.slice(0, lastIdx)}</q>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result;
}
function parseFuntionCall(content: string) {
  return content.replace(/(\w+)\.(\w+)/g, ($, $1, $2) => {
    if (isFile($2)) {
      return $;
    }
    return `<span class=declare-func-call>${$1}</span>.${$2}`
  });
}
function parseFuntionExecute(content: string) {
  return content.replace(/(\w+)(\s*)\(/g, ($, $1, $2) => `<span class=declare-func-execute>${$1}</span>${$2}(`);
}
function parseNormalData(content: string) {
  if (!isNormalData(content)) {
    return content;
  }
  let result = '';
  let datas = content.split(",");
  for (let i = 0, n = datas.length; i < n; i++) {
    result += `<span class=declare-normal-data>${datas[i]}</span>${isNeedEndChar(i, n, ',')}`
  }
  return result;
}
function parseDeclareConstant(text: string) {
  return text.replace(/(const|let|var|int|long long|short|final|char|byte\[?\]?)(\s+[{}\w\s,]+)/gi, ($, $1, $2) => {
    return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>`
  })
}
function parseNumber(text: string) {
  return text.replace(/(\d+)/g, ($, $1) => `<span class=declare-number>${$1}</span>`)
}

function parseOperatorChar(text: string) {
  return text.replace(/(this|super|interface|export\s+default|export|import|from|extends|new|implements|abstract|void|static|return|break|continue|goto|switch|case|finally|try|catch|else|if|throw)/g, ($, $1) => {
    return `<span class=declare-operator-char>${$1}</span>`
  })
}
function parseClass(text: string) {
  // PS: 为了保险起见 只解析后面带花括号的class
  return text.replace(/(class\s+)(.*\s+)({)/g, ($, $1, $2, $3) => {
    return `<span class=declare-class>${$1}</span><span class=declare-class-name>${$2}</span>${$3}`
  })
}
function parsePropCall(text: string) {
  return text.replace(/\.(\w+)/g, ($, $1) => `.<span class=decalre-prop-call>${$1}</span>`)
}
// 单行注释
function parseSingleComments(text: string) {
  return `<span class=declare-comments>${text}</span>`
}
// 处理/* */ 类型注释
function parseSpecComents(text: string) {
  return text.replace(/\/\*.*\*\//g, ($) => {
    return `<span class=declare-comments>${$}</span>`
  })
}

// 处理等号后面的数据
function parseAssignmentStatement(text: string) {
  return text.replace(/(\w+)(\s+\w+\s*)=(\s*\w+)/g, ($, $1, $2, $3) => {
    if (isHTMLTag($1)) {
      return $;
    }
    return `<span class=declare-object>${$1}</span><span declare class=declare-constant-name>${$2}</span>=${$3}`;
  })
}