import { isNeedEndChar, lineNumber, native } from "../../../utils";
import { ITransformOptions } from "../../core/parseToHTML";
import parseJSSyntax from "../js";

// 处理html语法，TODO: 属性内换行的解析...
export default function parseHTMLSyntax(syntax: string, line: number, options: ITransformOptions): string {
  if (/(<!--.*-->)/g.test(syntax)) {
    // 处理注释内容
    return `${genPrefixer(line, options)}<span class=declare-comments>${native(RegExp.$1)}</span></p>`
  } else if (/(\s*)<(\!?\w+)(.*)>(.*)<\/\w+>/g.test(syntax)) {
    // 处理标签都在同一行的情况
    let attrs = RegExp.$3.trim().split(" "), result = processAttrs(attrs);
    return `${genPrefixer(line, options)}${RegExp.$1}&lt<span class=declare-html-tag>${RegExp.$2}</span>${result && '&nbsp;' + result}&gt${RegExp.$4}&lt/<span class=declare-html-tag>${RegExp.$2}</span>&gt</p>`
  } else if (/(\s*)<(\!?\w+)(.*)>/g.test(syntax)) {
    // 处理只有开标签的情况
    let attrs = RegExp.$3.trim().split(" "), result = processAttrs(attrs);
    return `${genPrefixer(line, options)}${RegExp.$1}&lt<span class=declare-html-tag>${RegExp.$2}</span>${result && '&nbsp;' + result}&gt</p>`
  } else if (/(\s*)<\/(\w+)>/g.test(syntax)) {
    // 处理只有闭标签的情况
    return `${genPrefixer(line, options)}${RegExp.$1}&lt/<span class=declare-html-tag>${RegExp.$2}</span>&gt</p>`
  } else {
    // 处理标签中间文本的情况(可能为script中的脚本)
    return parseJSSyntax(syntax, line++, options);
  }
}

// 解决冗余的字符串
function genPrefixer(line: number, options: ITransformOptions) {
  return `<p class=line-code>${lineNumber(line, options.lineNumber)}`
}
// 处理标签内部属性
function processAttrs(attrs: string[]) {
  let result = '';
  for (let i = 0, n = attrs.length; i < n; i++) {
    let attr = attrs[i];
    if (!attr.trim()) {
      result += attr;
      continue;
    }
    // 只取第一次出现的=（对于meta标签中可能会出现属性中也存在=，这里需要排除）
    let splitIdx = attr.indexOf("=");
    if (splitIdx != -1) {
      let key = attr.slice(0, splitIdx), value = attr.slice(splitIdx + 1)
      result += `<span class=declare-attr-key>${key}</span>=<span class=declare-attr-value>${value}</span>${isNeedEndChar(i, n, '&nbsp;')}`
    } else {
      // 匹配不到属性了
      result += attr;
      continue;
    }
  }
  return result;
}