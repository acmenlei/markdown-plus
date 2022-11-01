import { isHeadLayoutEnd, isMultColumnStart } from "../../utils/index";
import markdownToHTML from "./parseToHTML";
import parseLayout from "./parseLayout"

export default function parseHeadLayout(templates: string[], i: number, templateLength: number) {
  let resultStr = `<div class=head-layout>`;
  ++i;
  while (i < templateLength && !isHeadLayoutEnd(templates[i])) {
    if (isMultColumnStart(templates[i])) {
      const { startIdx, result } = parseLayout(templates, i, templateLength);
      resultStr += result;
      i = startIdx + 1;
    } else {
      resultStr += templates[i].trim() ? markdownToHTML(templates[i]) : '';
      i++;
    }
  }
  resultStr += '</div>'
  return { result: resultStr, startIdx: i }
}