import { matchSuperLink } from "../../utils/index";

export function parseSuperLink(s: string) {
  let result = '';
  while (matchSuperLink.test(s)) {
    let altStartIdx = s.indexOf('[');
    let prefix = s.slice(0, altStartIdx);
    result += prefix;
    s = s.slice(altStartIdx + 1);
    let altEndIdx = s.indexOf('](');
    let alt = s.slice(0, altEndIdx);
    s = s.slice(altEndIdx + 2);
    let linkEnd = s.indexOf(")");
    let link = s.slice(0, linkEnd);
    s = s.slice(linkEnd + 1);
    result += `<a href=${link} target="_blank">${alt}</a>`;
  }
  return result + s;
}