import { isNeedEndChar } from "../../utils";
import { TemplateList } from "./parseToHTML";

export function parseCodePre(templates: TemplateList, i: number, templateLength: number) {
  let result = '', language = templates[i].slice(3).trim(), line = 1;
  ++i;
  while (i < templateLength && !templates[i].startsWith("```")) {
    result += parseSyntaxAndLineNumber(templates[i], line++);
    i++;
  }
  // 以防下次进入, 结束标志
  templates[i] = '';
  return { startIdx: i, result: `<pre language=${language}><code>${result}</code></pre>` };
}

export function parseLineCode(text: string) {
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
function parseSyntaxAndLineNumber(syntax: string, line: number) {
  let result = parseDeclareKeyWords(syntax);
  result = parseFunctionOrMethod(result);
  result = parseFunctionCall(result);
  result = parseClass(result);
  result = parseOperatorChar(result);
  result = parseSingleComments(result);
  result = parseManyLineComents(result);
  return `<p class=line-code><span class='line-number'>${line}</span>${result}</p>`
}

function parseDeclareKeyWords(text: string) {
  return text.replace(/(const|let|var|int|long long|short|final|char|byte\[?\]?)(.*)\s*=(.*)/gi, ($, $1, $2, $3) => {
    return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>=<span class=declare-value>${parseDeclareString($3)}</span>`
  })
}

function parseDeclareString(text: string) {
  return text.replace(/[\'\"](.*)[\'\"]/, ($, $1) => `<span class=declare-string>${$1}</span>`)
}
// 一站式解析所有语言的函数
function parseFunctionOrMethod(text: string) {
  return text.replace(/(function)(\s+\w+)(\s*\((\w+\s*\w+,?\s*)*\)?)/, ($, $1, $2, $3, $4, $5) => {
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

function parseFunctionCall(text: string) {
  return text.replace(/(\w+\.?)+\((.*)\)/, ($, $1, $2, $3) => {
    let calls = $.split("."), callStr = '';
    // console.log(calls)
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

function parseSingleComments(text: string) {
  return text.replace(/(\s*(\/\/|#)\s*.*)/, ($, $1) => `<span class=declare-comments>${$1}</span>`)
}

function parseManyLineComents(text: string) {
  console.log(/\/\*(.*)\*\//m.test(text))
  if (/\/\*(.*)\*\//m.test(text)) {
    console.log(text)
  }
  return text;
}

function parseClass(text: string) {
  // PS: 为了保险起见 只解析后面带花括号的class
  return text.replace(/(class\s+)(.*\s+)({)/, ($, $1, $2, $3) => {
    return `<span class=declare-class>${$1}</span><span class=declare-class-name>${$2}</span>${$3}`
  })
}
// 解析extends｜new｜implements｜abstract等
function parseOperatorChar(text: string) {
  return text.replace(/(extends|new|implements|abstract|void|static)/, ($, $1) => `<span class=declare-operator-char>${$1}</span>`)
}