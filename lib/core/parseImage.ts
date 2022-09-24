export function processImage() {
  return `<img alt=${RegExp.$1} src=${RegExp.$2} />`;
}