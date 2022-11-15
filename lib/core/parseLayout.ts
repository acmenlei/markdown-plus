import { isMultColumn, isMultColumnEnd, isMultColumnStart } from "../../utils/index";
import markdownToHTML, { ITransformOptions } from "./parseToHTML";

export default function parseLayout(templates: string[], i: number, templateLength: number, options: ITransformOptions) {
  let resultStr = `<div class=flex-layout>`, tmpS = '';
  ++i;
  while (i < templateLength && !isMultColumnEnd(templates[i])) {
    if (isMultColumnStart(templates[i])) {
      const { result, startIdx } = parseLayout(templates, i, templateLength, options);
      tmpS += result;
      i = startIdx;
    } else if (isMultColumn(templates[i])) {
      resultStr += `<div class=flex-layout-item>${markdownToHTML(tmpS, { ...options, xss: false })}</div>`;
      tmpS = '';
    } else {
      tmpS += templates[i].trim() ? templates[i] + '\n' : '';
    }
    i++;
  }
  resultStr += `<div class=flex-layout-item>${markdownToHTML(tmpS, { ...options, xss: false })}</div>`;
  resultStr += `</div>`;
  return { result: resultStr, startIdx: i }
}