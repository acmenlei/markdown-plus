// 处理水平分割线
export function parseHorizontalLine(text: string) {
  if(text.length !== 3) {
    return text;
  }
  return text === '---' ? `<hr/>` : text;
}