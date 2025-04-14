import { matchTitle } from "../../utils/index";
import { parseNormalText } from "./parseText";

export function getTitleLevel(level: string) {
  return level.length > 6 ? 6 : level.length;
}

export function parseTitle(s: string) {
  return s.trim().replace(matchTitle, ($1, $2, $3) => {
    return `<h${getTitleLevel($2)}>${parseNormalText($3, true)}</h${getTitleLevel($2)}>`;
  });
}