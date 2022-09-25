export function parseSuperLink() {
  return `<a href=${RegExp.$2}>${RegExp.$1}</a>`
}