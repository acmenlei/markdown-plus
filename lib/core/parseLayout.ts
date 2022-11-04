import { isMultColumn, isMultColumnEnd } from "../../utils/index";
import markdownToHTML from "./parseToHTML";

export default function parseLayout(templates: string[], i: number, templateLength: number) {
  let result = `<div class=flex-layout>`, tmpS = '';
  ++i;
  while (i < templateLength && !isMultColumnEnd(templates[i])) {
    if (isMultColumn(templates[i])) {
      result += `<div class=flex-layout-item>${markdownToHTML(tmpS)}</div>`;
      tmpS = '';
    } else {
      tmpS += templates[i].trim() ? templates[i] + '\n' : '';
    }
    i++;
  }
  result += `<div class=flex-layout-item>${markdownToHTML(tmpS)}</div>`;
  result += `</div>`;
  return { result, startIdx: i }
}