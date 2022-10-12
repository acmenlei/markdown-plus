import parseHTMLSyntax from "./html"
import parseCSyntax from "./c"
import parseJavaSyntax from "./java"
import parseJSSyntax from "./js"
import parseTSSyntax from "./ts"

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