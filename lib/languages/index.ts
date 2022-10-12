import parseHTMLSyntax from "./html"
import parseCSyntax from "./c"
import parseJavaSyntax from "./java"
import parseJSSyntax from "./js"
import parseTSSyntax from "./ts"

export type ParserSyntax = (templateLine: string, line: number) => string;
export interface ILanguages {
  java: ParserSyntax;
  c: ParserSyntax;
  ['c++']: ParserSyntax;
  ['c#']: ParserSyntax;
  js: ParserSyntax;
  ts: ParserSyntax;
  javascript: ParserSyntax;
  typescript: ParserSyntax;
  html: ParserSyntax;
}

const languages = {
  ['java']: parseJavaSyntax,
  ['c']: parseCSyntax,
  ['c++']: parseCSyntax,
  ['c#']: parseCSyntax,
  ['js']: parseJSSyntax,
  ['javascript']: parseJSSyntax,
  ['ts']: parseTSSyntax,
  ['typescript']: parseTSSyntax,
  ['html']: parseHTMLSyntax,
}

export default languages;