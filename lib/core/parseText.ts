export function parseNormalText(text: string) {
  let result = processStrongText(text);
  result = processObliqueText(result);
  return `<p>${result}</p>`;
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