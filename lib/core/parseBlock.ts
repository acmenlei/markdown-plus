export function parseBlock(text: string) {
  return `<blockquote>${text.slice(1)}</blockquote>`
}