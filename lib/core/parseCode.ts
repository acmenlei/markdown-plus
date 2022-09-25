import { isNeedEndChar } from "../../utils";
import { TemplateList } from "./parseToHTML";

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
// 处理html语法
function parseHTMLSyntax(syntax: string, line: number) {
  if (/<(\w+)(.*)>(.*)<\/\w+>/g.test(syntax)) {
    return syntax.replace(/<(\w+)(.*)>(.*)<\/\w+>/g, ($, $1, $2, $3) => {
      let attrs = $2.trim().split(" "), result = processAttrs(attrs);
      return `${genPrefixer(line)}<span class=declare-html-tag>${$1}</span>${result && '&nbsp;' + result}&gt${$3}&lt/<span class=declare-html-tag>${$1}</span>&gt</p>`
    })
  } else if (/<(\w+)(.*)>/g.test(syntax)) {
    let attrs = RegExp.$2.trim().split(" "), result = processAttrs(attrs);
    return `${genPrefixer(line)}<span class=declare-html-tag>${RegExp.$1}</span>${result && '&nbsp;' + result}&gt</p>`
  } else if (/<\/(\w+)>/g.test(syntax)) {
    return `${genPrefixer(line)}/<span class=declare-html-tag>${RegExp.$1}</span>&gt</p>`
  } else {
    // 文本(可能为script中的脚本)
    return parseSyntaxAndLineNumber(syntax, line++);
  }
}
// 解决冗余的字符串
function genPrefixer(line) {
  return `<p class=line-code><span class='line-number'>${line}</span>&lt`
}

function processAttrs(attrs: string[]) {
  let result = '';
  for (let i = 0, n = attrs.length; i < n; i++) {
    let attr = attrs[i];
    if (!attr.trim()) {
      result += attr;
      continue;
    }
    let [key, value] = attr.split("=");
    result += `<span class=declare-attr-key>${key}</span>=<span class=declare-attr-value>${value}</span>${isNeedEndChar(i, n, '&nbsp;')}`
  }
  return result;
}

// TODO: 词法分析暂时先这么写 后续补充。。
function parseSyntaxAndLineNumber(syntax: string, line: number) {
  let result = parseDeclareKeyWords(syntax);
  result = parseDeclareString(result);
  result = parseKeyValueNumber(result);
  result = parseFunctionOrMethod(result);
  result = parseFunctionCall(result);
  result = parseOperatorChar(result);
  result = parseClass(result);
  result = parseSingleComments(result);
  result = parseManyLineComents(result);
  return `<p class=line-code><span class='line-number'>${line}</span>${result}</p>`
}

function parseDeclareKeyWords(text: string) {
  return text.replace(/(const|let|var|int|long long|short|final|char|byte\[?\]?)(.*)\s*=(.*)/gi, ($, $1, $2, $3) => {
    return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>=<span class=${getClassOfType($3)}>${parseDeclareString($3)}</span>`
  })
}
// 解析字符串
function parseDeclareString(text: string) {
  return text.replace(/([\'\"].*[\'\"])/g, ($, $1) => `<span class=declare-string>${$1}</span>`)
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
// 函数调用
function parseFunctionCall(text: string) {
  return text.replace(/(\w+\.?)+\((.*)\)/g, ($, $1, $2, $3) => {
    let calls = $.split("."), callStr = '';
    for (let i = 0, n = calls.length; i < n; i++) {
      if (/\((.*)\)/.test(calls[i])) {
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
  return text.replace(/(export\s+default|export|import|from|extends|new|implements|abstract|void|static)/g, ($, $1) => {
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