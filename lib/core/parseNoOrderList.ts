import { genTemplateStringOfNodes, processForamt } from "../../utils";
import { TemplateList } from "./parseToHTML";

export interface IListItem {
  value: string;
  children: Array<IListItem>;
  level: number;
  parent: IListItem | null;
}

export function parseNoOrderList(templates: TemplateList, i: number, templateLength: number) {
  let result = '';
  for (; i < templateLength; i++) {
    if (templates[i].indexOf("-") != -1) {
      result += templates[i] + '\n';
    } else {
      break;
    }
  }
  result = processNoOrderList(result);
  return { startIdx: i, result };
}

function processNoOrderList(template: string) {
  const list: Array<string> | null = template.match(/(\s?)+-\s(.*)/g)
  if (!list) {
    return template;
  }
  processForamt(list)
  const nodes = genListHelper(list);
  const root = genTemplateStringOfNodes(nodes, false);
  return root;
}

function genListHelper(list: string[]) {
  const results: IListItem[] = [], currentOperStack: IListItem[] = [], n = list.length;

  for (let i = 0; i < n; i++) {
    const level = list[i].indexOf("-")
    const listItem: IListItem = { children: [], value: list[i].slice(level + 1), level, parent: null }

    if (!currentOperStack.length) {
      results.push(listItem);
      currentOperStack.push(listItem);
      continue;
    }
    const topLevel = currentOperStack[currentOperStack.length - 1].level;
    const curLevel = list[i].indexOf("-");
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