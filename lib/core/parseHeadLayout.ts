import { isHeadLayoutEnd } from "../../utils/index";
import { ITransformOptions, markdownToHTML } from "./parseToHTML";

export default function parseHeadLayout(
  templates: string[],
  i: number,
  templateLength: number,
  options: ITransformOptions
) {
  let resultStr = `<div class=head-layout>`,
    subStr = "";
  ++i;
  while (i < templateLength && !isHeadLayoutEnd(templates[i])) {
    if (templates[i].trim()) {
      subStr += templates[i] + "\n";
    }
    i++;
  }
  resultStr += markdownToHTML(subStr, { ...options, xss: false }) + "</div>";
  return { result: resultStr, startIdx: i };
}
