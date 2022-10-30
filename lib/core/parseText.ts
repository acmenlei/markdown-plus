import { parseImage } from "./parseImage";
import { parseSuperLink } from "./parseSuperLink";

export function parseNormalText(text: string) {
  let result = processStrongText(text);
  result = processObliqueText(result);
  result = parseSingleLineCode(result);
  result = parseSuperLink(result);
  result = parseImage(result);
  result = parseIcon(result);
  return `${result}`;
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
  return text.replace(/icon:(\w+)\s/g, ($, $1) => {
    return `<i class='iconfont icon-${$1}'></i>`;
  })
}