import { parseNormalText } from "./parseText";

export function parseTable(
  templates: string[],
  i: number,
  templateLength: number
) {
  let result = "<table>";
  // 处理标题
  result += processTableTHead(templates[i]);
  result += `<tbody >`;
  ++i;
  for (; i < templateLength; i++) {
    if (templates[i].trim()[0] === "|") {
      result += processTabletBody(templates[i]);
    } else {
      break;
    }
  }
  result += `</tbody></table>`;
  result = result.replace(/<tr><\/tr>/, "");
  return { startIdx: i - 1, result };
}

function processTableTHead(s: string) {
  let preIdx = -1,
    template = "<thead><tr>";
  for (let i = 0, n = s.length; i < n; i++) {
    if (
      s[i] == "|" &&
      isValidedSplitChar(s, i - 1) &&
      isValidedSplitChar(s, i + 1)
    ) {
      if (preIdx != -1) {
        template += `<th>${parseNormalText(s.slice(preIdx + 1, i))}</th>`;
      }
      preIdx = i;
    }
  }
  return template + `</tr></thead>`;
}

function processTabletBody(s: string) {
  let preIdx = -1,
    template = "<tr>";
  for (let i = 0, n = s.length; i < n; i++) {
    if (
      s[i] == "|" &&
      isValidedSplitChar(s, i - 1) &&
      isValidedSplitChar(s, i + 1)
    ) {
      if (preIdx != -1) {
        let cnts = s.slice(preIdx + 1, i);
        if (cnts.trim()[0] === "-") {
          continue;
        }
        template += `<td>${parseNormalText(cnts)}</td>`;
      }
      preIdx = i;
    }
  }
  return template + `</tr>`;
}

function isValidedSplitChar(s: string, i: number) {
  return s[i] === " " || s[i] == undefined;
}
