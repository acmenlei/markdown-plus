export function getTitleLevel(level: string) {
  return level.length > 6 ? 6 : level.length;
}
