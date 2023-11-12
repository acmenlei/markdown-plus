import { TemplateList } from "./parseToHTML";
import { IListItem } from "./parseNoOrderList";
import {
  genTemplateStringOfNodes,
  isOrderList,
  processFormat,
} from "../../utils/index";

export function parseOrderList(
  templates: TemplateList,
  i: number,
  templateLength: number
) {
  let result = "";
  for (; i < templateLength; i++) {
    if (!templates[i].trim()) {
      continue;
    }
    if (isOrderList(templates[i])) {
      // 把内容抠出来
      result += templates[i] + "\n";
    } else {
      break;
    }
  }
  result = processOrderList(result);
  return { startIdx: i, result };
}

export function processOrderList(template: string) {
  const list: Array<string> | null = template.match(/\s*\d+\.\s(.+)/g);
  if (!list) {
    return template;
  }
  processFormat(list);
  const nodes = genListHelper(list);
  const root = genTemplateStringOfNodes(nodes, true);
  return root;
}

function genListHelper(list: string[]) {
  const results: IListItem[] = [],
    currentOperStack: IListItem[] = [],
    n = list.length;
  for (let i = 0; i < n; i++) {
    let level = 0, isOrder = false;
    if (isOrderList(list[i])) {
      level = list[i].indexOf(String(RegExp.$1 + "."));
      isOrder = true
    }
    const listItem: IListItem = {
      children: [],
      // 空格数量 + 序号字符串本身 + '.' = 起始切割位置
      value: RegExp.$2,
      level,
      isOrder,
      parent: null,
    };
    if (!currentOperStack.length) {
      results.push(listItem);
      currentOperStack.push(listItem);
      continue;
    }
    const topLevel = currentOperStack[currentOperStack.length - 1].level;
    const curLevel = level;
    let parent: IListItem | null;

    if (topLevel === curLevel) {
      parent = currentOperStack[currentOperStack.length - 1].parent;
    } else {
      if (topLevel > curLevel) {
        while (currentOperStack[currentOperStack.length - 1].level > curLevel) {
          currentOperStack.pop();
        }
        parent = currentOperStack[currentOperStack.length - 1].parent;
      } else {
        parent = currentOperStack[currentOperStack.length - 1];
      }
    }
    listItem.parent = parent;
    parent ? parent.children.push(listItem) : results.push(listItem);
    currentOperStack.push(listItem);
  }
  return results;
}
