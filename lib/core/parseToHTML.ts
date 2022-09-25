import { matchTitle } from './../../utils/index';
import { parseBlock } from "./parseBlock";
import { parseSingleLineCode, parseCodePre } from "./parseCode";
import { parseNoOrderList } from "./parseNoOrderList";
import { parseImage } from "./parseImage";
import { parseSuperLink } from "./parseSuperLink";
import { parseOrderList } from "./parseOrderList"
import { parseNormalText } from "./parseText";
import { getTitleLevel } from "./parseTitle";
import { isBLock, isImage, isNoOrderList, isOrderList, isPreCode, isSuperLink, isTitle } from "../../utils";

export type TemplateList = string[];
export type TemplateStr = string;

export default function markdownToHTML(template: string) {
  const templates: TemplateList = template.split('\n');
  let templateStr: TemplateStr = '', len = templates?.length || 0;
  for (let i = 0; i < len;) {
    if (isTitle(templates[i])) {
      // 说明为标题
      let curTitle = templates[i].trim();
      templateStr += curTitle.replace(matchTitle, ($1, $2, $3) => {
        return `<h${getTitleLevel($2)}>${$3}</h${getTitleLevel($2)}>`;
      });
    } else if (isNoOrderList(templates[i])) {
      // 说明为无序列表
      const { result, startIdx } = parseNoOrderList(templates, i, len);
      // 重置开始检索的位置
      i = startIdx;
      // 将解析得到的结果进行拼接
      templateStr += result;
    } else if (isOrderList(templates[i])) {
      // 说明为有序列表
      const { result, startIdx } = parseOrderList(templates, i, len);
      // 重置开始检索的位置
      i = startIdx;
      // 将解析得到的结果进行拼接
      templateStr += result;
    } else if (isPreCode(templates[i])) {
      // 代码块
      const { result, startIdx } = parseCodePre(templates, i, len);
      i = startIdx;
      templateStr += result;
    } else if (isSuperLink(templates[i])) {
      // 说明为超链接
      templateStr += parseSuperLink();
    } else if (isImage(templates[i])) {
      // 说明为图片
      templateStr += parseImage();
    } else if (isBLock(templates[i])) {
      // 说明为代码块
      templateStr += parseBlock(templates[i]);
    } else {
      // 处理普通文字
      if (templates[i] = templates[i].trim()) {
        templateStr += parseSingleLineCode(parseNormalText(templates[i]));
      }
    }
    i++;
  }
  return templateStr;
}
