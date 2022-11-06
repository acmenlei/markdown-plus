import { isMultColumn, isMultColumnEnd, isMultColumnStart } from "../../utils/index";
import markdownToHTML from "./parseToHTML";

export default function parseLayout(templates: string[], i: number, templateLength: number) {
  let resultStr = `<div class=flex-layout>`, tmpS = '';
  ++i;
  while (i < templateLength && !isMultColumnEnd(templates[i])) {
    if (isMultColumnStart(templates[i])) {
      const { result, startIdx } = parseLayout(templates, i, templateLength);
      tmpS += result;
      i = startIdx;
    } else if (isMultColumn(templates[i])) {
      resultStr += `<div class=flex-layout-item>${markdownToHTML(tmpS)}</div>`;
      tmpS = '';
    } else {
      tmpS += templates[i].trim() ? templates[i] + '\n' : '';
    }
    i++;
  }
  resultStr += `<div class=flex-layout-item>${markdownToHTML(tmpS)}</div>`;
  resultStr += `</div>`;
  return { result: resultStr, startIdx: i }
}