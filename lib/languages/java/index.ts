import {
  isComments,
  isNeedEndChar,
  isSpecLineComments,
  matchSpecComments,
  parseBoolean,
  parseNumber,
  parseString,
  parseNull,
  lineNumber
} from "../../../utils";
import { ITransformOptions } from "../../core/parseToHTML";

export default function parseJavaSyntax(content: string, line: number, options: ITransformOptions): string {
  let template = '';
  let s = content.split('\n');
  for (let i = 0; i < s.length; i++) {
    let sub = s[i];
    template += analysisOfGrammar(sub, line++, options)
  }
  return template;
}

// 语法分析
function analysisOfGrammar(s: string, line: number, options: ITransformOptions) {
  let st: string[] = [], tmpStr = '', l = 0, res = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] == ")") {
      let cur: string | undefined = '';
      while (st.length && (cur = st.pop()) != '(') {
        tmpStr = cur + tmpStr;
      }
      if (cur != '(') {
        // 换行缺少开括号
        st.push(processParcel(tmpStr + ')', false))
      } else {
        l--;
        st.push(processParcel(tmpStr, true))
      }
      tmpStr = '';
    } else {
      s[i] == "(" && l++;
      st.push(s[i]);
    }
  }
  let last = 0;
  while (l--) {
    last = st.lastIndexOf("(");
    res = "(" + processParcel(st.slice(last + 1).join(""), false) + res;
    st = st.slice(0, last);
  }
  if (st.length) {
    res = processParcel(st.join(""), false) + res
  }
  return `<p>${lineNumber(line, options.lineNumber)}<span>${res}</span></p>`
}

function processParcel(inner: string, parcel: boolean): string {
  if (!inner.trim()) {
    return parcel ? `(${inner})` : inner;
  }
  // 是否是注释
  if (isComments(inner.trim())) {
    return parseSingleComments(inner);
  }
  let result = inner;
  result = parseSpecComents(result)
  result = parseParcelData(result);
  result = parseOperatorChar(result);
  result = parseString(result);
  result = parseFuntionExecute(result)
  result = parseBoolean(result);
  result = parseNumber(result);
  result = parseNull(result);
  return parcel ? `(${result})` : result;
}

function parseParcelData(content: string): string {
  // filter expression syntax
  // match default value not undefiend
  if (/^(char|int|String|Byte\[?\]?|[A-Z]+)/.test(content.trim())) {
    if (/(\w+\s+)(.*\s*)=(.*)/.test(content)) {
      return content.replace(/(\s*\w+\s+)(.*\s*)=(.*)/, ($, $1, $2, $3) => {
        return `${parseDeclareConstant($1)}${parserSubContent($2)}=${parseParcelData($3)}`
      })
    }
    // match default value is undefiend
    if (/(\w+\s+)(.*\s*)/.test(content)) {
      return content.replace(/(\s*\w+\s+)(.*\s*)/, ($, $1, $2, $3) => {
        return `${parseDeclareConstant($1)}${parserSubContent($2)}`
      })
    }
  }
  // process default 
  let result = '';
  let datas = content.split(",");
  for (let i = 0, n = datas.length; i < n; i++) {
    result += `${parserSubContent(datas[i])}${isNeedEndChar(i, n, ',')}`
  }
  return result;
}

const matchNormalType = /(\s*\w+\s*)?:(\s*\w+\s*)/g,
  matchGenericType = /(:\s*\w+\s*)?&lt;(\s*\/?\s*\w+\s*)&gt;/g;
function parserSubContent(s: string) {
  if (matchGenericType.test(s)) {
    return s.replace(matchGenericType, ($, $1, $2) => {
      let rest = $1 ? `<span class=declare-param-type>${$1}</span>` : '';
      return `${rest}&lt;<span class=declare-param-type>${$2}</span>&gt;`;
    })
  }
  if (matchNormalType.test(s)) {
    return s.replace(matchNormalType, ($, $1, $2) => {
      if (!$1) {
        return `:<span class=declare-param-type>${$2}</span>`
      }
      return `<span class=declare-param>${$1}</span>:<span class=declare-param-type>${$2}</span>`
    })
  }
  return s;
}

function parseFuntionExecute(content: string) {
  return content.replace(/(\w+)(\s*)\(/g, ($, $1, $2) => `<span class=declare-func-execute>${$1}</span>${$2}(`);
}

function parseDeclareConstant(text: string) {
  return text.replace(/(const|let|var|int|string|Byte\[?\]?|[A-Z]+)(\s+)/gi, ($, $1, $2) => {
    return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>`
  })
}

function parseOperatorChar(text: string) {
  if (isSpecLineComments(text)) {
    return parseSpecComents(text);
  }
  return text.replace(/(class|in|of|this|super|interface|module|import|from|extends|new|abstract|void|static|return|break|continue|switch|case|finally|try|catch|else|if|throw)(?=[\s\(\.])/g, ($, $1) => {
    return `<span class=declare-operator-char>${$1}</span>`
  })
}

// 单行注释
function parseSingleComments(text: string) {
  return `<span class=declare-comments>${text}</span>`
}
// 处理/* */ 类型注释
function parseSpecComents(text: string) {
  return text.replace(matchSpecComments, ($) => {
    return `<span class=declare-comments>${$}</span>`
  })
}