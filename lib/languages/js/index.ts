import { isComments, isFuntionKeyWord, isNeedEndChar, isSpecLineComments, matchFunction, matchSpecComments } from "../../../utils";

export default function parseJSSyntax(content: string, line: number) {
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
  let st: string[] = [], tmpStr = '', l = 0, res = '';
  // The string must be processed first, and may contain such symbols, affecting subsequent matches
  s = parseString(s);
  let n = s.length;
  for (let i = 0; i < n; i++) {
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
  return `<p><span class=line-number>${line}</span><span>${res}</span></p>`
}

function processParcel(inner: string, parcel: boolean) {
  if (!inner.trim()) {
    return parcel ? `(${inner})` : inner;
  }
  // 是否是注释
  if (isComments(inner.trim())) {
    return parseSingleComments(inner);
  }
  let result = inner;
  result = parseSpecComents(result)
  result = parseString(result);
  result = parseParcelData(result);
  result = parseOperatorChar(result);
  result = parseArrowFunction(result);
  result = parseFuntionExecute(result);
  result = parseFuntion(result);
  result = parseBoolean(result);
  result = parseNumber(result);
  return parcel ? `(${result})` : result;
}

function parseParcelData(content: string) {
  // filter expression syntax
  // match default value not undefiend
  if (/^(const|int|string|var|let)/.test(content.trim())) {
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

function parserSubContent(s: string) {
  if (/(\s*\w+\s*)?:(\s*\w+\s*)/.test(s)) {
    // console.log('处理返回值类型：', s)
    return s.replace(/(\s*\w+\s*)?:(\s*\w+\s*)/, ($, $1, $2) => {
      if (!$1) {
        return `:<span class=declare-param-type>${$2}</span>`
      }
      return `<span class=declare-param>${$1}</span>:<span class=declare-param-type>${$2}</span>`
    })
  }
  if (isFuntionKeyWord(s)) {
    return parseFuntion(s)
  }
  return s;
}

function parseFuntion(s: string) {
  return s.replace(matchFunction, ($, $1, $2) => {
    return `<span class=declare-function>${$1}</span>${$2}`
  })
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
    text.indexOf('\"') != -1 ? even = true : {};
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = even ? text.indexOf("\"") : text.indexOf("\'");
    result += `<q class=declare-string>${text.slice(0, lastIdx)}</q>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result;
}

function parseFuntionExecute(content: string) {
  return content.replace(/(\w+)(\s*)\(/g, ($, $1, $2) => `<span class=declare-func-execute>${$1}</span>${$2}(`);
}

function parseDeclareConstant(text: string) {
  // byte\[?\]?
  return text.replace(/(const|let|var)(\s+)/gi, ($, $1, $2) => {
    return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>`
  })
}

function parseOperatorChar(text: string) {
  if (isSpecLineComments(text)) {
    return parseSpecComents(text);
  }
  return text.replace(/(class|await|async|this|as|super|module|export\s+default|export|import|from|while|extends|new|abstract|void|static|return|break|continue|switch|case|finally|try|catch|else|if|throw)(?=[\s+\(\.])/g, ($, $1) => {
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

function parseBoolean(s: string) {
  return s.replace(/([^\w])(false|true)(?!\w)/g, ($, $1, $2) => `${$1}<span class=declare-boolean>${$2}</span>`)
}

function parseNumber(s: string) {
  return s.replace(/([^\w])(\d+)(?![\w\.])/g, ($, $1, $2) => `${$1}<span class=declare-number>${$2}</span>`)
}