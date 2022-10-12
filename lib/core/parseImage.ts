export function parseImage() {
  return `<p><img alt=${RegExp.$1} src=${RegExp.$2} /></p>`;
}