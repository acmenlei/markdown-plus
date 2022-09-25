export function parseBlock(text: string) {
  return `<blockquote>${text.slice(2)}</blockquote>`
}