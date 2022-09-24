export function  parseNormalText(text: string) {
  let result = '', idx = -1;
  while ((idx = text.indexOf("**")) != -1) {
    result += text.slice(0, idx);
    text = text.slice(idx + 2)
    let lastIdx = text.indexOf("**");
    result += `<strong>${text.slice(0, lastIdx)}</strong>`;
    text = text.slice(lastIdx + 2)
  }
  text && (result += text);
  return `<p>${result}</p>`
}