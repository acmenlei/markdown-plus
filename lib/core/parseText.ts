import { parseImage } from "./parseImage";
import { parseSuperLink } from "./parseSuperLink";

export function parseNormalText(text: string, inner: boolean = false) {
  let result = processStrongText(text);
  result = processObliqueText(result);
  result = processStrongText2(result);
  result = processObliqueText2(result);
  result = parseSingleLineCode(result);
  result = processDeleteText(result);
  result = parseImage(result);
  result = parseSuperLink(result);
  result = parseIcon(result);
  return inner ? result : `<p>${result}</p>`;
}

function processStrongText(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("**")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 2)
    let lastIdx = text.indexOf("**");
    result += `<strong>${text.slice(0, lastIdx)}</strong>`;
    text = text.slice(lastIdx + 2)
  }
  text && (result += text);
  return result;
}
function processStrongText2(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("__")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 2)
    let lastIdx = text.indexOf("__");
    result += `<strong>${text.slice(0, lastIdx)}</strong>`;
    text = text.slice(lastIdx + 2)
  }
  text && (result += text);
  return result;
}
function processObliqueText(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("*")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = text.indexOf("*");
    result += `<i>${text.slice(0, lastIdx)}</i>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result;
}
function processObliqueText2(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("_")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 1)
    let lastIdx = text.indexOf("_");
    result += `<i>${text.slice(0, lastIdx)}</i>`;
    text = text.slice(lastIdx + 1)
  }
  text && (result += text);
  return result;
}
// 删除线
function processDeleteText(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("~~")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 2)
    let lastIdx = text.indexOf("~~");
    result += `<del>${text.slice(0, lastIdx)}</del>`;
    text = text.slice(lastIdx + 2)
  }
  text && (result += text);
  return result;
}
// 处理单行code
function parseSingleLineCode(text: string) {
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
// 处理图标
function parseIcon(text: string) {
  return text.replace(/icon:(\w+)(\s|\b)/g, ($, $1) => {
    return `<i class='iconfont icon-${$1}'></i>`;
  })
}