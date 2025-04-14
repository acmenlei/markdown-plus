import { isHeadLayoutStart, isMultColumn, isMultColumnEnd, isMultColumnStart } from "../../utils/index";
import parseHeadLayout from "./parseHeadLayout";
import { ITransformOptions, markdownToHTML } from "./parseToHTML";

export default function parseLayout(templates: string[], i: number, templateLength: number, options: ITransformOptions) {
  let resultStr = `<div class=flex-layout>`, tmpS = '';
  ++i;
  while (i < templateLength && !isMultColumnEnd(templates[i])) {
    if (isMultColumnStart(templates[i])) {
      const { result, startIdx } = parseLayout(templates, i, templateLength, options);
      tmpS += result;
      i = startIdx;
    } else if (isHeadLayoutStart(templates[i])) {
      const { result, startIdx } = parseHeadLayout(templates, i, templateLength, options)
      tmpS += result;
      i = startIdx;
    } else if (isMultColumn(templates[i])) {
      resultStr += `<div class=flex-layout-item>${markdownToHTML(tmpS, { ...options, xss: false })}</div>`;
      tmpS = '';
    } else {
      tmpS += templates[i].trim() ? '\n' + templates[i] + '\n' : '';
    }
    i++;
  }
  resultStr += `<div class=flex-layout-item>${markdownToHTML(tmpS, { ...options, xss: false })}</div>`;
  resultStr += `</div>`;
  return { result: resultStr, startIdx: i }
}