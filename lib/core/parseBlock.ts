export function processBlock(text: string) {
  return `<blockquote>${text.slice(2)}</blockquote>`
}