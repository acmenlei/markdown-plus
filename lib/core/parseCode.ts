import { isNeedEndChar } from "../../utils";
import { parseHTMLSyntax } from "../languages/html";
import { TemplateList } from "./parseToHTML";
/**
 * 这里暂时只处理了脚本和html，后续会考虑继续增加。。(除了标记语言，所有语言都是统一进行处理的)
 * @param templates md切割后的模版
 * @param i 当前开始处理位置
 * @param templateLength 模板的总长度
 * @returns 解析后的带语法高亮的代码块
 */
export function parseCodePre(templates: TemplateList, i: number, templateLength: number) {
  let result = '', language = templates[i].slice(3).trim(), line = 1;
  ++i;
  let isHTML = language.toLowerCase() === 'html';
  while (i < templateLength && !templates[i].startsWith("```")) {
    result += isHTML ? parseHTMLSyntax(templates[i], line++) : parseSyntaxAndLineNumber(templates[i], line++);
    i++;
  }
  // 以防下次进入, 结束标志
  templates[i] = '';
  return { startIdx: i, result: `<pre language=${language}><code>${result}</code></pre>` };
}
// 处理单行code
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
  return result
}

// TODO: 词法分析暂时先这么写 后续补充。。
export function parseSyntaxAndLineNumber(syntax: string, line: number) {
  let result = parseDeclareKeyWords(syntax);
  result = parseKeyValueNumber(result);
  result = parseDeclareString(result);
  result = parseFunctionOrMethod(result);
  result = parseSingleFunctionKeyWord(result);
  result = parseFunctionCall(result);
  result = parseOperatorChar(result);
  result = parseClass(result);
  result = parseSingleComments(result);
  result = parseManyLineComents(result);
  return `<p class=line-code><span class=line-number>${line}</span>${result}</p>`
}
// 解析声明关键字
function parseDeclareKeyWords(text: string) {
  return text.replace(/(const|let|var|int|long long|short|final|char|byte\[?\]?)(.*)\s*=(.*)/gi, ($, $1, $2, $3) => {
    return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>=<span class=${getClassOfType($3)}>${parseDeclareString($3)}</span>`
  })
}
// 解析字符串
function parseDeclareString(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("\"")) != -1 || (idx = text.indexOf("\'")) != -1) {
    let even = false;
    text.indexOf("\"") != -1 ? even = true : {};
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = even ? text.indexOf("\"") : text.indexOf("\'");
    result += `<span class=declare-string>"${text.slice(0, lastIdx)}"</span>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result;
}
// 解析JavaScript函数语法
function parseFunctionOrMethod(text: string) {
  // PS：注释和 Generator的语法可能会冲突（需要尽可能的采用标准写法）
  return text.replace(/(function)(\s*\*?\s*\w+)(\s*\((\w+\s*\w+,?\s*)*\)?)/g, ($, $1, $2, $3) => {
    let paramsStr = '', paramLen = $3.trim().slice(1, $3.trim().length - 1);
    if (paramLen) {
      let params: string[] = paramLen.split(",");
      for (let i = 0, n = params.length; i < n; i++) {
        // 判断是否有类型限制
        let curParam = params[i].trim().split(" ");
        if (curParam.length == 2) {
          paramsStr += `<span class=declare-param-type>${curParam[0]}</span>&nbsp;<span class=declare-param>${curParam[1]}</span>${isNeedEndChar(i, n, ', ')}`
        } else {
          paramsStr += `<span class=declare-param>${params[i]}</span>${i < n - 1 ? ', ' : ''}`
        }
      }
    }
    paramsStr += ')';
    paramsStr = '(' + paramsStr;
    return `<span class=declare-method>${$1}</span><span class=declare-method-name>${$2}</span><span class=declare-method-params>${paramsStr}</span>`
  })
}
// 处理箭头函数
function parseSingleFunctionKeyWord(text: string) {
  return text.replace(/function/g, ($) => `<span class=declare-function>${$}</span>`);
}
// 函数调用
function parseFunctionCall(text: string) {
  return text.replace(/(\w+\.?)+\((.*)\)/g, ($) => {
    let calls = $.split("."), callStr = '';
    for (let i = 0, n = calls.length; i < n; i++) {
      if (/(.*)\s*=>(.*)/g.test(calls[i])) {
        // TODO：箭头函数解析部分
        callStr += calls[i].replace('console', 'console.');
      } else if (/\((.*)\)/.test(calls[i])) {
        let idx = calls[i].indexOf("(");
        callStr += `<span class=declare-call-execute>${calls[i].slice(0, idx)}</span>(<span class=declare-call-execute-value>${RegExp.$1}</span>)${isNeedEndChar(i, n, '.')}`
      } else {
        callStr += `<span class=declare-method-call>${calls[i]}</span>.`
      }
    }
    return callStr;
  })
}
// 单行注释
function parseSingleComments(text: string) {
  return text.replace(/(\s*(\/\/|#)\s*.*)/g, ($, $1) => `<span class=declare-comments>${$1}</span>`)
}
// 多行注释
function parseManyLineComents(text: string) {
  return text.replace(/(\/\*|\*\s+\w+|\*\/)/g, ($, $1) => {
    return `<span class=declare-comments>${$1}</span>`
  })
}
// 类
function parseClass(text: string) {
  // PS: 为了保险起见 只解析后面带花括号的class
  return text.replace(/(class\s+)(.*\s+)({)/g, ($, $1, $2, $3) => {
    return `<span class=declare-class>${$1}</span><span class=declare-class-name>${$2}</span>${$3}`
  })
}
// 解析extends｜new｜implements｜abstract等
function parseOperatorChar(text: string) {
  return text.replace(/(interface|export\s+default|export|import|from|extends|new|implements|abstract|void|static|return|break|continue|goto|switch|case|finally|try|catch|if|throw)/g, ($, $1) => {
    return `<span class=declare-operator-char>${$1}</span>`
  })
}
// 解析数字
function parseKeyValueNumber(text: string) {
  return text.replace(/(\w+\s*[:=]\s*)(\d+)/g, ($, $1, $2) => {
    return `${$1}<span class=declare-number>${$2}</span>`
  })
}
// 根据内容展示不同的样式（数字｜字符串｜普通变量）
function getClassOfType(text: string) {
  text = text.trim();
  let last = text[text.length - 1];
  if (last == ',' || last == ';') {
    text = text.slice(0, text.length - 1);
  }
  return isNaN(Number(text)) ? 'declare-value' : 'declare-number';
} 