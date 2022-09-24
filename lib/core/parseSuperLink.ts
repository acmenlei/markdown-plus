export function processSuperLink() {
  return `<a href=${RegExp.$2}>${RegExp.$1}</a>`
}