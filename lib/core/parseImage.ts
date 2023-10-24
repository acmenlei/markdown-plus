import { matchImage } from "../../utils/index";

export function parseImage(s: string) {
  let result = '';
  while (matchImage.test(s)) {
    let altStartIdx = s.indexOf('![');
    let prefix = s.slice(0, altStartIdx);
    result += prefix;
    s = s.slice(altStartIdx + 2);
    let altEndIdx = s.indexOf('](');
    let alt = s.slice(0, altEndIdx);
    s = s.slice(altEndIdx + 2);
    let linkEnd = s.indexOf(")");
    let link = s.slice(0, linkEnd);
    s = s.slice(linkEnd + 1);
    result += `<img alt=${alt} src=${link} />`;
  }
  return result + s;
}