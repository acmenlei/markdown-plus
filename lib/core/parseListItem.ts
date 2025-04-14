import {
  genTemplateStringOfNodes,
  isNoOrderList,
  isOrderList,
  processFormat,
} from "../../utils/index";
import { TemplateList } from "./parseToHTML";

export function parseListItem(
  templates: TemplateList,
  i: number,
  templateLength: number
) {
  let result = "";
  for (; i < templateLength; i++) {
    if (!templates[i].trim()) {
      continue;
    }
    if (isOrderList(templates[i]) || isNoOrderList(templates[i])) {
      result += templates[i] + "\n";
    } else {
      break;
    }
  }
  result = processList(result);
  return { startIdx: i, result };
}

function processList(template: string) {
  const list: Array<string> | null = template.match(/(\s)*(-|\d+\.)\s(.+)/g);
  if (!list) {
    return template;
  }
  processFormat(list);
  const nodes = parseNoOrderSyntax(list);
  const root = genTemplateStringOfNodes(nodes);
  return root;
}
// 定义列表项的接口
export interface IListItem {
  type: "no_order" | "order";
  content: string;
  children: IListItem[];
}

/**
 * 解析无序列表语法的函数
 * @param list 包含Markdown列表语法的字符串数组
 * @returns 解析后的列表项数组
 */
function parseNoOrderSyntax(list: string[]): IListItem[] {
  // 初始化变量
  const lines = list;
  const result: IListItem[] = [];
  const stack: { indent: number; item: IListItem }[] = [];

  // 遍历输入的字符串数组
  lines.forEach((line) => {
    // 跳过空行
    if (line.trim() === "") {
      return;
    }

    // 计算行首空格数和去除首空格后的内容
    const leadingSpaces = line.length - line.trimLeft().length;
    const lineContent = line.trim();

    // 处理缩进，弹出不再需要的项
    while (stack.length && leadingSpaces <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    let item: IListItem | null = null;

    // 判断是否为无序列表项
    if (/^-\s/.test(lineContent)) {
      item = { type: "no_order", content: lineContent.slice(2), children: [] };
    }
    // 判断是否为有序列表项
    else if (/^(\d+\.)\s/.test(lineContent)) {
      item = {
        type: "order",
        content: lineContent.slice(RegExp.$1.length),
        children: [],
      };
    }

    // 如果成功识别列表项，则将其添加到结果数组中
    if (item) {
      if (stack.length) {
        stack[stack.length - 1].item.children.push(item);
      } else {
        result.push(item);
      }
      stack.push({ indent: leadingSpaces, item });
    }
  });

  return result;
}
