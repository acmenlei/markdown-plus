import { TemplateList } from "./parseToHTML";
import { IListItem } from './parseNoOrderList';
import { genTemplateStringOfNodes, matchOrderList, processForamt } from "../../utils";

export function parseOrderList(templates: TemplateList, i: number, templateLength: number) {
  let result = '';
  for (; i < templateLength; i++) {
    if (matchOrderList.test(templates[i])) {
      result += templates[i] + '\n';
    } else {
      break;
    }
  }
  result = processOrderList(result);
  return { startIdx: i, result };
}

export function processOrderList(template: string) {
  const list: Array<string> | null = template.match(/\s*\d\.(.*)/g)
  if (!list) {
    return template;
  }
  processForamt(list)
  const nodes = genListHelper(list);
  const root = genTemplateStringOfNodes(nodes, true);
  return root;
}

function genListHelper(list: string[]) {
  const results: IListItem[] = [], currentOperStack: IListItem[] = [], n = list.length;
  for (let i = 0; i < n; i++) {
    let level = 0;
    if (matchOrderList.test(list[i])) {
      level = list[i].indexOf(String(RegExp.$1 + "."));
    }
    const listItem: IListItem = { children: [], value: list[i].slice(level + 2), level, parent: null }

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

