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

    // 匹配alt中的\d*x\d*宽高px
    const width = alt.match(/\((\d*x\d*)\)/);
    const [w, h] = width?.[width?.length - 1].split('x') ?? [];
    s = s.slice(altEndIdx + 2);
    let linkEnd = s.indexOf(")");
    let link = s.slice(0, linkEnd);
    s = s.slice(linkEnd + 1);
    if(w && h) {
      result += `<img alt="${alt}" src=${link} style="width: ${w}px; height: ${h}px;" />`;
    } else {
      result += `<img alt="${alt}" src=${link} />`;
    }
  }
  return result + s;
}