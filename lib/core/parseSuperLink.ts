export function parseSuperLink() {
  return `<p><a href=${RegExp.$2}>${RegExp.$1}</a><p>`
}