import { isHeadLayoutEnd, isMultColumnStart } from "../../utils/index";
import markdownToHTML, { ITransformOptions } from "./parseToHTML";
import parseLayout from "./parseLayout"

export default function parseHeadLayout(templates: string[], i: number, templateLength: number, options: ITransformOptions) {
  let resultStr = `<div class=head-layout>`;
  ++i;
  while (i < templateLength && !isHeadLayoutEnd(templates[i])) {
    if (isMultColumnStart(templates[i])) {
      const { startIdx, result } = parseLayout(templates, i, templateLength, options);
      resultStr += result;
      i = startIdx + 1;
    } else {
      // 只需要处理一次xss，后面是内部生成的dom标签，不能替换掉
      resultStr += templates[i].trim() ? markdownToHTML(templates[i], { ...options, xss: false }) : '';
      i++;
    }
  }
  resultStr += '</div>'
  return { result: resultStr, startIdx: i }
}