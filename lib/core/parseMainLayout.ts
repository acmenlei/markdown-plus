import { isMainLayoutEnd } from "../../utils/index";
import { ITransformOptions, markdownToHTML } from "./parseToHTML";

export default function parseMainLayout(
  templates: string[],
  i: number,
  templateLength: number,
  options: ITransformOptions
) {
  let resultStr = `<div class=main-layout>`,
    subStr = "";
  ++i;
  while (i < templateLength && !isMainLayoutEnd(templates[i])) {
    if (templates[i].trim()) {
      subStr += templates[i] + "\n";
    }
    i++;
  }
  resultStr += markdownToHTML(subStr, { ...options, xss: false }) + "</div>";
  return { result: resultStr, startIdx: i };
}
