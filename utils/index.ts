import { IListItem } from "../lib/core/parseNoOrderList";
// 正则
export const matchTitle: RegExp = /(#+)\s(.*)/g, matchOrderList = /^\s*(\d)\./, matchSuperLink = /^\[(.*)\]\((.*)\)/, matchImage = /^\!\[(.*)\]\((.*)\)/;

export function processForamt(list: string[]) {
  // 多个换行合并为一个
  if (/^\s+/.test(list[0])) {
    list[0] = list[0].replace(/^(\s+)/g, ($1) => '\n')
  }
  // 如果第一个元素没有换行符 那么就给他加上（后续的判断需要依赖换行符）
  if (!list[0].startsWith('\n')) {
    list[0] = '\n' + list[0];
  }
}
// 有序列表无序列表的生成
export function genTemplateStringOfNodes(nodes: IListItem[], isOrder: boolean) {
  let listString = "";
  for (let node of nodes) {
    let childrenString = node.children.length ? genTemplateStringOfNodes(node.children, isOrder) : '';
    listString += `<li>${node.value}${childrenString}</li>`
  }
  return `<${isOrder ? 'ol' : 'ul'}>${listString}</${isOrder ? 'ol' : 'ul'}>`
}

export function isOrderList(s: string) {
  return matchOrderList.test(s)
}

export function isNoOrderList(s: string) {
  return s.indexOf("-") != -1
}

export function isTitle(s: string) {
  return s.indexOf("#") != -1
}

export function isImage(s: string) {
  return matchImage.test(s)
}

export function isSuperLink(s: string) {
  return matchSuperLink.test(s)
}

export function isPreCode(s: string) {
  return s.startsWith("```")
}

export function isBLock(s: string) {
  return s.startsWith("> ")
}

export function isNeedEndChar(i: number, n: number, ch: string) {
  return i < n - 1 ? ch : '';
}