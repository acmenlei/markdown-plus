import { isMultColumnStart, isTable, matchTitle } from './../../utils/index';
import { parseBlock } from "./parseBlock";
import { parseCode } from "./parseCode";
import { parseNoOrderList } from "./parseNoOrderList";
import { parseOrderList } from "./parseOrderList"
import { parseNormalText } from "./parseText";
import { getTitleLevel } from "./parseTitle";
import { isBLock, isImage, isNoOrderList, isOrderList, isPreCode, isSuperLink, isTitle } from "../../utils/index";
import { parseTable } from './parseTable';
import parseLayout from './parseLayout';

export type TemplateList = string[];
export type TemplateStr = string;
export interface ITransformOptions {
  lineNumber?: boolean;
  highlight?: boolean;
}

const defaultOptions: ITransformOptions = {
  lineNumber: false,
  highlight: false
}

export default function markdownToHTML(template: string, options?: ITransformOptions) {
  const templates: TemplateList = template.split('\n');
  let templateStr: TemplateStr = '', len = templates?.length || 0;
  for (let i = 0; i < len;) {
    if (isTitle(templates[i])) {
      // 说明为标题
      let curTitle = templates[i].trim();
      templateStr += curTitle.replace(matchTitle, ($1, $2, $3) => {
        return `<h${getTitleLevel($2)}>${$3}</h${getTitleLevel($2)}>`;
      });
    } else if(isMultColumnStart(templates[i])) {
      const { result, startIdx } = parseLayout(templates, i, len)
      // 重置开始检索的位置
      i = startIdx;
      // 将解析得到的结果进行拼接
      templateStr += result;
    } else if (isTable(templates[i])) {
      const { result, startIdx } = parseTable(templates, i, len)
      // 重置开始检索的位置
      i = startIdx;
      // 将解析得到的结果进行拼接
      templateStr += result;
    } else if (isNoOrderList(templates[i])) {
      // 说明为无序列表
      const { result, startIdx } = parseNoOrderList(templates, i, len);
      i = startIdx;
      templateStr += result;
    } else if (isOrderList(templates[i])) {
      // 说明为有序列表
      const { result, startIdx } = parseOrderList(templates, i, len);
      i = startIdx;
      templateStr += result;
    } else if (isPreCode(templates[i])) {
      // 代码块
      const { result, startIdx } = parseCode(templates, i, len, options || defaultOptions);
      i = startIdx;
      templateStr += result;
    } else if (isBLock(templates[i])) {
      // 说明为代码块
      templateStr += parseBlock(templates[i]);
    } else {
      // 处理普通文字
      if (templates[i] = templates[i].trim()) {
        templateStr += parseNormalText(templates[i]);
      }
    }
    i++;
  }
  return templateStr;
}
