import {
  isHeadLayoutStart,
  isMultColumnStart,
  isTable,
  native,
  isHorizontalLine,
  isMainLayoutStart,
} from "../../utils/index";
import { parseBlock } from "./parseBlock";
import { parseCode } from "./parseCode";
import { parseHorizontalLine } from "./parseHorLine";
import { parseNormalText } from "./parseText";
import { parseTitle } from "./parseTitle";
import {
  isBLock,
  isNoOrderList,
  isOrderList,
  isPreCode,
  isTitle,
} from "../../utils/index";
import { parseTable } from "./parseTable";
import parseLayout from "./parseLayout";
import parseHeadLayout from "./parseHeadLayout";
import parseMainLayout from "./parseMainLayout";
import { parseListItem } from "./parseListItem";

export type TemplateList = string[];
export type TemplateStr = string;
export interface ITransformOptions {
  lineNumber?: boolean;
  highlight?: boolean;
  xss?: boolean;
}

const defaultOptions: ITransformOptions = {
  lineNumber: false,
  highlight: false,
  xss: true, // 默认进行xss处理
};
export function markdownToHTML(template: string, options?: ITransformOptions) {
  let op = options || defaultOptions,
    templateStr: TemplateStr = "";
  op = Object.assign({ ...defaultOptions }, op);
  let templates: TemplateList = op.xss
      ? native(template).split("\n")
      : template.split("\n"),
    len = templates?.length || 0;

  for (let i = 0; i < len; ) {
    if (isTitle(templates[i])) {
      // 说明为标题
      templateStr += parseTitle(templates[i]);
    } else if (isHeadLayoutStart(templates[i])) {
      const { result, startIdx } = parseHeadLayout(templates, i, len, op);
      i = startIdx;
      templateStr += result;
    } else if (isMainLayoutStart(templates[i])) {
      const { result, startIdx } = parseMainLayout(templates, i, len, op);
      i = startIdx;
      templateStr += result;
    } else if (isMultColumnStart(templates[i])) {
      const { result, startIdx } = parseLayout(templates, i, len, op);
      // 重置开始检索的位置
      i = startIdx;
      // 将解析得到的结果进行拼接
      templateStr += result;
    } else if (isHorizontalLine(templates[i])) {
      // 处理水平分割线
      templateStr += parseHorizontalLine(templates[i]);
      ++i;
    } else if (isTable(templates[i])) {
      const { result, startIdx } = parseTable(templates, i, len);
      // 重置开始检索的位置
      i = startIdx;
      // 将解析得到的结果进行拼接
      templateStr += result;
    } else if (isNoOrderList(templates[i]) || isOrderList(templates[i])) {
      // 说明为无序列表
      const { result, startIdx } = parseListItem(templates, i, len);
      // 这里进入了当前分支 下面就不会走了 防止这个选项漏掉 那么我们需要回退一步 下面处理有序列表也是一样的
      // （分支处理结构引出的问题）
      i = startIdx - 1;
      templateStr += result;
    } else if (isPreCode(templates[i])) {
      // 代码块
      const { result, startIdx } = parseCode(templates, i, len, op);
      i = startIdx;
      templateStr += result;
    } else if (isBLock(templates[i].trim())) {
      // 说明为段落块
      templateStr += parseBlock(templates[i].trim());
    } else {
      // 处理普通文字
      if ((templates[i] = templates[i].trim())) {
        templateStr += parseNormalText(templates[i]);
      }
    }
    i++;
  }
  return templateStr;
}
