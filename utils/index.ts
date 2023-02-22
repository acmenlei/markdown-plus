import { IListItem } from "../lib/core/parseNoOrderList";
import { parseNormalText } from "../lib/core/parseText";
// 正则
export const matchTitle: RegExp = /(#+)\s(.*)/g, matchOrderList = /^\s*(\d)\./,
  matchSuperLink = /\[(.*)\]\((.*)\)/, matchImage = /!\[(.*)\]\((.*)\)/,
  matchSpecComments = /\/\*(.*)\*\//g, matchFunction = /(function)([\s\(&lt])/g;

export function processForamt(list: string[]) {
  // 多个换行合并为一个
  if (/^\s+/.test(list[0])) {
    list[0] = list[0].replace(/^(\s+)/g, ($1) => '\n')
  }
  // 如果第一个元素没有换行符 那么就给他加上（后续的判断需要依赖换行符）
  if (!list[0].startsWith('\n')) {
    list[0] = '\n' + list[0];
  }
}
// 有序列表无序列表的生成
export function genTemplateStringOfNodes(nodes: IListItem[], isOrder: boolean) {
  let listString = "";
  for (let node of nodes) {
    let childrenString = node.children.length ? genTemplateStringOfNodes(node.children, isOrder) : '';
    listString += `<li>${parseNormalText(node.value + childrenString, true)}</li>`
  }
  return `<${isOrder ? 'ol' : 'ul'}>${listString}</${isOrder ? 'ol' : 'ul'}>`
}

export function isOrderList(s: string) {
  return matchOrderList.test(s)
}

export function isNoOrderList(s: string) {
  let idx = s.indexOf("-")
  return (idx == 0) || (idx != -1 && !s.slice(0, idx).trim())
}

export function isTitle(s: string) {
  return s.indexOf("#") != -1
}

export function isImage(s: string) {
  return matchImage.test(s)
}

export function isSuperLink(s: string) {
  return matchSuperLink.test(s)
}

export function isPreCode(s: string) {
  return s.startsWith("```")
}

export function isBLock(s: string) {
  return s.startsWith("> ")
}

export function isNeedEndChar(i: number, n: number, ch: string) {
  return i < n - 1 ? ch : '';
}

export function isHTMLTag(s: string) {
  return ["span", "p", "q", "ul", "li", "ol", "div", "strong", "a", "h1", "h2", "h3", "h4", "h5", "h6", "i"]
    .includes(s)
}
// 暂时写这么多 以后补充...
export function isFile(s: string) {
  return ["txt", 'vue', 'js', 'css', 'html', 'png', 'jpg', 'gif', 'ts', 'less', 'scss', 'json', 'md'].includes(s);
}
// 普通数据 上面的匹配条件都没有被匹配到 
export function isNormalData(content: string) {
  return !content.includes("<") &&
    !content.includes(")") &&
    !content.includes("(") &&
    !content.includes("{") &&
    !content.includes("}");
}
// 是否是注释节点
export function isComments(s: string) {
  return s.startsWith("//") || s.startsWith("/*") || s.startsWith("*") || s.startsWith("#");
}
// 是否是水平分割线
export function isHorizontalLine(s: string) {
  return s.trim() === '---';
}
export function isFrontChar(i: number, s: string) {
  return i !== 0 ? s : ''
}

export function isTable(s: string) {
  return s.trim()[0] === '|';
}
export function isSpecLineComments(s: string) {
  return matchSpecComments.test(s)
}

export function isFuntionKeyWord(s: string) {
  return matchFunction.test(s)
}

export function parseString(text: string) {
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

export function parseBoolean(s: string) {
  return s.replace(/([^\w])(false|true)(?!\w)/g, ($, $1, $2) => `${$1}<span class=declare-boolean>${$2}</span>`)
}

export function parseNumber(s: string) {
  return s.replace(/([^\w])(\d+)(?![\w\.])/g, ($, $1, $2) => `${$1}<span class=declare-number>${$2}</span>`)
}

export function parseNull(s: string) {
  return s.replace(/(\s*null)(?!\w)/g, ($, $1) => `<span class=declare-operator-char>${$1}</span>`)
}

export function native(s: string) {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function lineNumber(line: number, need: boolean | undefined) {
  return need ? `<span class=line-number>${line}</span>` : '';
}

export function isMultColumnStart(s: string) {
  return s.trim().startsWith("::: start");
}
export function isMultColumnEnd(s: string) {
  return s.trim().startsWith("::: end");
}
export function isMultColumn(s: string) {
  return s.trim().startsWith(":::");
}

export function isHeadLayoutStart(s: string) {
  return s.trim().startsWith("::: headStart")
}

export function isHeadLayoutEnd(s: string) {
  return s.trim().startsWith("::: headEnd")
}