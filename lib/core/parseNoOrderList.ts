import { genTemplateStringOfNodes, isNoOrderList, isOrderList, processFormat } from "../../utils/index";
import { TemplateList } from "./parseToHTML";

export interface IListItem {
  value: string;
  children: Array<IListItem>;
  level: number;
  parent: IListItem | null;
  isOrder: boolean
}

export function parseNoOrderList(templates: TemplateList, i: number, templateLength: number) {
  let result = '';
  for (; i < templateLength; i++) {
    if (!templates[i].trim()) {
      continue;
    }
    if (isOrderList(templates[i]) || isNoOrderList(templates[i])) {
      result += templates[i] + '\n';
    } else {
      break;
    }
  }
  result = processNoOrderList(result);
  return { startIdx: i, result };
}

function processNoOrderList(template: string) {
  const list: Array<string> | null = template.match(/(\s?)*(-|\d+\.)\s(.+)/g)
  if (!list) {
    return template;
  }
  processFormat(list)
  const nodes = genListHelper(list);
  const root = genTemplateStringOfNodes(nodes, false);
  return root;
}

function genListHelper(list: string[]) {
  const results: IListItem[] = [], currentOperStack: IListItem[] = [], n = list.length;

  for (let i = 0; i < n; i++) {
    let level = list[i].indexOf("- "), isOrder = false
    if (isOrderList(list[i])) {
      level = list[i].indexOf(String(RegExp.$1 + "."));
      // console.log(level)
      isOrder = true
    }
    const listItem: IListItem = { children: [], value: list[i].slice(level + 2), level, parent: null, isOrder }
    if (!currentOperStack.length) {
      results.push(listItem);
      currentOperStack.push(listItem);
      continue;
    }
    const topLevel = currentOperStack[currentOperStack.length - 1].level;
    let curLevel = list[i].indexOf("-");
    if (isOrderList(list[i])) {
      curLevel = list[i].indexOf(String(RegExp.$1 + "."));
    }
    let parent: IListItem | null;

    if (topLevel === curLevel) {
      parent = currentOperStack[currentOperStack.length - 1].parent;
    } else {
      if (topLevel > curLevel) {
        while (currentOperStack[currentOperStack.length - 1].level > curLevel) {
          currentOperStack.pop()
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