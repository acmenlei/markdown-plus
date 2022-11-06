function parseImage(s) {
    let result = '';
    while (matchImage.test(s)) {
        let altStartIdx = s.indexOf('![');
        let prefix = s.slice(0, altStartIdx);
        result += prefix;
        s = s.slice(altStartIdx + 1);
        let altEndIdx = s.indexOf('](');
        let alt = s.slice(0, altEndIdx);
        s = s.slice(altEndIdx + 2);
        let linkEnd = s.indexOf(")");
        let link = s.slice(0, linkEnd);
        s = s.slice(linkEnd + 1);
        result += `<p><img alt=${alt} src=${link} /></p>`;
    }
    return result + s;
}

function parseSuperLink(s) {
    let result = '';
    while (matchSuperLink.test(s)) {
        let altStartIdx = s.indexOf('[');
        let prefix = s.slice(0, altStartIdx);
        result += prefix;
        s = s.slice(altStartIdx + 1);
        let altEndIdx = s.indexOf('](');
        let alt = s.slice(0, altEndIdx);
        s = s.slice(altEndIdx + 2);
        let linkEnd = s.indexOf(")");
        let link = s.slice(0, linkEnd);
        s = s.slice(linkEnd + 1);
        result += `<a href=${link}>${alt}</a>`;
    }
    return result + s;
}

function parseNormalText(text, inner = false) {
    let result = processStrongText(text);
    result = processObliqueText(result);
    result = parseSingleLineCode(result);
    result = parseImage(result);
    result = parseSuperLink(result);
    result = parseIcon(result);
    return inner ? result : `<p>${result}</p>`;
}
function processStrongText(text) {
    let result = '', idx = -1;
    while ((idx = text.indexOf("**")) != -1) {
        result += text.slice(0, idx);
        text = text.slice(idx + 2);
        let lastIdx = text.indexOf("**");
        result += `<strong>${text.slice(0, lastIdx)}</strong>`;
        text = text.slice(lastIdx + 2);
    }
    text && (result += text);
    return result;
}
function processObliqueText(text) {
    let result = '', idx = -1;
    while ((idx = text.indexOf("*")) != -1) {
        result += text.slice(0, idx);
        text = text.slice(idx + 1);
        let lastIdx = text.indexOf("*");
        result += `<i>${text.slice(0, lastIdx)}</i>`;
        text = text.slice(lastIdx + 1);
    }
    text && (result += text);
    return result;
}
// 处理单行code
function parseSingleLineCode(text) {
    let result = '', idx = -1;
    while ((idx = text.indexOf("`")) != -1) {
        result += text.slice(0, idx);
        text = text.slice(idx + 1);
        let lastIdx = text.indexOf("`");
        result += `<code class=single-code>${text.slice(0, lastIdx)}</code>`;
        text = text.slice(lastIdx + 1);
    }
    text && (result += text);
    return result;
}
// 处理图标
function parseIcon(text) {
    return text.replace(/icon:(\w+)(\s|\b)/g, ($, $1) => {
        return `<i class='iconfont icon-${$1}'></i>`;
    });
}

// 正则
const matchTitle = /(#+)\s(.*)/g, matchOrderList = /^\s*(\d)\./, matchSuperLink = /\[(.*)\]\((.*)\)/, matchImage = /!\[(.*)\]\((.*)\)/, matchSpecComments = /\/\*(.*)\*\//g, matchFunction = /(function)([\s\(&lt])/g;
function processForamt(list) {
    // 多个换行合并为一个
    if (/^\s+/.test(list[0])) {
        list[0] = list[0].replace(/^(\s+)/g, ($1) => '\n');
    }
    // 如果第一个元素没有换行符 那么就给他加上（后续的判断需要依赖换行符）
    if (!list[0].startsWith('\n')) {
        list[0] = '\n' + list[0];
    }
}
// 有序列表无序列表的生成
function genTemplateStringOfNodes(nodes, isOrder) {
    let listString = "";
    for (let node of nodes) {
        let childrenString = node.children.length ? genTemplateStringOfNodes(node.children, isOrder) : '';
        listString += `<li>${parseNormalText(node.value + childrenString, true)}</li>`;
    }
    return `<${isOrder ? 'ol' : 'ul'}>${listString}</${isOrder ? 'ol' : 'ul'}>`;
}
function isOrderList(s) {
    return matchOrderList.test(s);
}
function isNoOrderList(s) {
    let idx = s.indexOf("-");
    return (idx == 0) || (idx != -1 && !s.slice(0, idx).trim());
}
function isTitle(s) {
    return s.indexOf("#") != -1;
}
function isPreCode(s) {
    return s.startsWith("```");
}
function isBLock(s) {
    return s.startsWith("> ");
}
function isNeedEndChar(i, n, ch) {
    return i < n - 1 ? ch : '';
}
// 是否是注释节点
function isComments(s) {
    return s.startsWith("//") || s.startsWith("/*") || s.startsWith("*") || s.startsWith("#");
}
function isTable(s) {
    return s.trim()[0] === '|';
}
function isSpecLineComments(s) {
    return matchSpecComments.test(s);
}
function isFuntionKeyWord(s) {
    return matchFunction.test(s);
}
function parseString(text) {
    let result = '', idx = -1;
    while ((idx = text.indexOf("\"")) != -1 || (idx = text.indexOf("\'")) != -1) {
        let even = false;
        text.indexOf('\"') != -1 ? even = true : {};
        result += text.slice(0, idx);
        text = text.slice(idx + 1);
        let lastIdx = even ? text.indexOf("\"") : text.indexOf("\'");
        result += `<q class=declare-string>${text.slice(0, lastIdx)}</q>`;
        text = text.slice(lastIdx + 1);
    }
    text && (result += text);
    return result;
}
function parseBoolean(s) {
    return s.replace(/([^\w])(false|true)(?!\w)/g, ($, $1, $2) => `${$1}<span class=declare-boolean>${$2}</span>`);
}
function parseNumber(s) {
    return s.replace(/([^\w])(\d+)(?![\w\.])/g, ($, $1, $2) => `${$1}<span class=declare-number>${$2}</span>`);
}
function parseNull(s) {
    return s.replace(/(\s*null)(?!\w)/g, ($, $1) => `<span class=declare-operator-char>${$1}</span>`);
}
function native(s) {
    return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function lineNumber(line, need) {
    return need ? `<span class=line-number>${line}</span>` : '';
}
function isMultColumnStart(s) {
    return s.trim().startsWith("::: start");
}
function isMultColumnEnd(s) {
    return s.trim().startsWith("::: end");
}
function isMultColumn(s) {
    return s.trim().startsWith(":::");
}
function isHeadLayoutStart(s) {
    return s.trim().startsWith("::: headStart");
}
function isHeadLayoutEnd(s) {
    return s.trim().startsWith("::: headEnd");
}

function parseBlock(text) {
    return `<blockquote>${text.slice(2)}</blockquote>`;
}

function parseJSSyntax(content, line, options) {
    let template = '';
    let s = content.split('\n');
    for (let i = 0; i < s.length; i++) {
        let sub = s[i];
        template += analysisOfGrammar$2(native(sub), line++, options);
    }
    return template;
}
// 语法分析
function analysisOfGrammar$2(s, line, options) {
    let st = [], tmpStr = '', l = 0, res = '';
    // The string must be processed first, and may contain such symbols, affecting subsequent matches
    s = parseString(s);
    let n = s.length;
    for (let i = 0; i < n; i++) {
        if (s[i] == ")") {
            let cur = '';
            while (st.length && (cur = st.pop()) != '(') {
                tmpStr = cur + tmpStr;
            }
            if (cur != '(') {
                // 换行缺少开括号
                st.push(processParcel$2(tmpStr + ')', false));
            }
            else {
                l--;
                st.push(processParcel$2(tmpStr, true));
            }
            tmpStr = '';
        }
        else {
            s[i] == "(" && l++;
            st.push(s[i]);
        }
    }
    let last = 0;
    while (l--) {
        last = st.lastIndexOf("(");
        res = "(" + processParcel$2(st.slice(last + 1).join(""), false) + res;
        st = st.slice(0, last);
    }
    if (st.length) {
        res = processParcel$2(st.join(""), false) + res;
    }
    return `<p>${lineNumber(line, options.lineNumber)}<span>${res}</span></p>`;
}
function processParcel$2(inner, parcel) {
    if (!inner.trim()) {
        return parcel ? `(${inner})` : inner;
    }
    // 是否是注释
    if (isComments(inner.trim())) {
        return parseSingleComments$2(inner);
    }
    let result = inner;
    result = parseSpecComents$2(result);
    result = parseString(result);
    result = parseParcelData$2(result);
    result = parseOperatorChar$2(result);
    result = parseArrowFunction$1(result);
    result = parseFuntionExecute$2(result);
    result = parseFuntion$1(result);
    result = parseBoolean(result);
    result = parseNumber(result);
    result = parseNull(result);
    return parcel ? `(${result})` : result;
}
function parseParcelData$2(content) {
    // filter expression syntax
    // match default value not undefiend
    if (/^(const|int|string|var|let)/.test(content.trim())) {
        if (/(\w+\s+)(.*\s*)=(.*)/.test(content)) {
            return content.replace(/(\s*\w+\s+)(.*\s*)=(.*)/, ($, $1, $2, $3) => {
                return `${parseDeclareConstant$2($1)}${parserSubContent$2($2)}=${parseParcelData$2($3)}`;
            });
        }
        // match default value is undefiend
        if (/(\w+\s+)(.*\s*)/.test(content)) {
            return content.replace(/(\s*\w+\s+)(.*\s*)/, ($, $1, $2, $3) => {
                return `${parseDeclareConstant$2($1)}${parserSubContent$2($2)}`;
            });
        }
    }
    // process default 
    let result = '';
    let datas = content.split(",");
    for (let i = 0, n = datas.length; i < n; i++) {
        result += `${parserSubContent$2(datas[i])}${isNeedEndChar(i, n, ',')}`;
    }
    return result;
}
function parserSubContent$2(s) {
    if (/(\s*\w+\s*)?:(\s*\w+\s*)/.test(s)) {
        return s.replace(/(\s*\w+\s*)?:(\s*\w+\s*)/, ($, $1, $2) => {
            if (!$1) {
                return `:<span class=declare-param-type>${$2}</span>`;
            }
            return `<span class=declare-param>${$1}</span>:<span class=declare-param-type>${$2}</span>`;
        });
    }
    if (isFuntionKeyWord(s)) {
        return parseFuntion$1(s);
    }
    return s;
}
function parseFuntion$1(s) {
    return s.replace(matchFunction, ($, $1, $2) => {
        return `<span class=declare-function>${$1}</span>${$2}`;
    });
}
function parseArrowFunction$1(content) {
    if (!content.includes("=>")) {
        return content;
    }
    return content.replace(/=>/g, ($) => `<span class=declare-arrow-func>${$}</span>`);
}
function parseFuntionExecute$2(content) {
    return content.replace(/(\w+)(\s*)\(/g, ($, $1, $2) => `<span class=declare-func-execute>${$1}</span>${$2}(`);
}
function parseDeclareConstant$2(text) {
    // byte\[?\]?
    return text.replace(/(const|let|var)(\s+)/gi, ($, $1, $2) => {
        return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>`;
    });
}
function parseOperatorChar$2(text) {
    if (isSpecLineComments(text)) {
        return parseSpecComents$2(text);
    }
    return text.replace(/(class|await|in|of|typeof|module|async|this|as|super|module|export\s+default|export|import|from|while|extends|new|abstract|void|static|return|break|continue|switch|case|finally|try|catch|else|if|throw)(?=[\s+\(\.])/g, ($, $1) => {
        return `<span class=declare-operator-char>${$1}</span>`;
    });
}
// 单行注释
function parseSingleComments$2(text) {
    return `<span class=declare-comments>${text}</span>`;
}
// 处理/* */ 类型注释
function parseSpecComents$2(text) {
    return text.replace(matchSpecComments, ($) => {
        return `<span class=declare-comments>${$}</span>`;
    });
}

// 处理html语法，TODO: 属性内换行的解析...
function parseHTMLSyntax(syntax, line, options) {
    if (/(<!--.*-->)/g.test(syntax)) {
        // 处理注释内容
        return `${genPrefixer(line, options)}<span class=declare-comments>${native(RegExp.$1)}</span></p>`;
    }
    else if (/(\s*)<(\!?\w+)(.*)>(.*)<\/\w+>/g.test(syntax)) {
        // 处理标签都在同一行的情况
        let attrs = RegExp.$3.trim().split(" "), result = processAttrs(attrs);
        return `${genPrefixer(line, options)}${RegExp.$1}&lt<span class=declare-html-tag>${RegExp.$2}</span>${result && '&nbsp;' + result}&gt${RegExp.$4}&lt/<span class=declare-html-tag>${RegExp.$2}</span>&gt</p>`;
    }
    else if (/(\s*)<(\!?\w+)(.*)>/g.test(syntax)) {
        // 处理只有开标签的情况
        let attrs = RegExp.$3.trim().split(" "), result = processAttrs(attrs);
        return `${genPrefixer(line, options)}${RegExp.$1}&lt<span class=declare-html-tag>${RegExp.$2}</span>${result && '&nbsp;' + result}&gt</p>`;
    }
    else if (/(\s*)<\/(\w+)>/g.test(syntax)) {
        // 处理只有闭标签的情况
        return `${genPrefixer(line, options)}${RegExp.$1}&lt/<span class=declare-html-tag>${RegExp.$2}</span>&gt</p>`;
    }
    else {
        // 处理标签中间文本的情况(可能为script中的脚本)
        return parseJSSyntax(syntax, line++, options);
    }
}
// 解决冗余的字符串
function genPrefixer(line, options) {
    return `<p class=line-code>${lineNumber(line, options.lineNumber)}`;
}
// 处理标签内部属性
function processAttrs(attrs) {
    let result = '';
    for (let i = 0, n = attrs.length; i < n; i++) {
        let attr = attrs[i];
        if (!attr.trim()) {
            result += attr;
            continue;
        }
        // 只取第一次出现的=（对于meta标签中可能会出现属性中也存在=，这里需要排除）
        let splitIdx = attr.indexOf("=");
        if (splitIdx != -1) {
            let key = attr.slice(0, splitIdx), value = attr.slice(splitIdx + 1);
            result += `<span class=declare-attr-key>${key}</span>=<span class=declare-attr-value>${value}</span>${isNeedEndChar(i, n, '&nbsp;')}`;
        }
        else {
            // 匹配不到属性了
            result += attr;
            continue;
        }
    }
    return result;
}

function parseCSyntax() {
    return '';
}

function parseJavaSyntax(content, line, options) {
    let template = '';
    let s = content.split('\n');
    for (let i = 0; i < s.length; i++) {
        let sub = s[i];
        template += analysisOfGrammar$1(sub, line++, options);
    }
    return template;
}
// 语法分析
function analysisOfGrammar$1(s, line, options) {
    let st = [], tmpStr = '', l = 0, res = '';
    for (let i = 0; i < s.length; i++) {
        if (s[i] == ")") {
            let cur = '';
            while (st.length && (cur = st.pop()) != '(') {
                tmpStr = cur + tmpStr;
            }
            if (cur != '(') {
                // 换行缺少开括号
                st.push(processParcel$1(tmpStr + ')', false));
            }
            else {
                l--;
                st.push(processParcel$1(tmpStr, true));
            }
            tmpStr = '';
        }
        else {
            s[i] == "(" && l++;
            st.push(s[i]);
        }
    }
    let last = 0;
    while (l--) {
        last = st.lastIndexOf("(");
        res = "(" + processParcel$1(st.slice(last + 1).join(""), false) + res;
        st = st.slice(0, last);
    }
    if (st.length) {
        res = processParcel$1(st.join(""), false) + res;
    }
    return `<p>${lineNumber(line, options.lineNumber)}<span>${res}</span></p>`;
}
function processParcel$1(inner, parcel) {
    if (!inner.trim()) {
        return parcel ? `(${inner})` : inner;
    }
    // 是否是注释
    if (isComments(inner.trim())) {
        return parseSingleComments$1(inner);
    }
    let result = inner;
    result = parseSpecComents$1(result);
    result = parseParcelData$1(result);
    result = parseOperatorChar$1(result);
    result = parseString(result);
    result = parseFuntionExecute$1(result);
    result = parseBoolean(result);
    result = parseNumber(result);
    result = parseNull(result);
    return parcel ? `(${result})` : result;
}
function parseParcelData$1(content) {
    // filter expression syntax
    // match default value not undefiend
    if (/^(char|int|String|Byte\[?\]?|[A-Z]+)/.test(content.trim())) {
        if (/(\w+\s+)(.*\s*)=(.*)/.test(content)) {
            return content.replace(/(\s*\w+\s+)(.*\s*)=(.*)/, ($, $1, $2, $3) => {
                return `${parseDeclareConstant$1($1)}${parserSubContent$1($2)}=${parseParcelData$1($3)}`;
            });
        }
        // match default value is undefiend
        if (/(\w+\s+)(.*\s*)/.test(content)) {
            return content.replace(/(\s*\w+\s+)(.*\s*)/, ($, $1, $2, $3) => {
                return `${parseDeclareConstant$1($1)}${parserSubContent$1($2)}`;
            });
        }
    }
    // process default 
    let result = '';
    let datas = content.split(",");
    for (let i = 0, n = datas.length; i < n; i++) {
        result += `${parserSubContent$1(datas[i])}${isNeedEndChar(i, n, ',')}`;
    }
    return result;
}
const matchNormalType$1 = /(\s*\w+\s*)?:(\s*\w+\s*)/g, matchGenericType$1 = /(:\s*\w+\s*)?&lt;(\s*\/?\s*\w+\s*)&gt;/g;
function parserSubContent$1(s) {
    if (matchGenericType$1.test(s)) {
        return s.replace(matchGenericType$1, ($, $1, $2) => {
            let rest = $1 ? `<span class=declare-param-type>${$1}</span>` : '';
            return `${rest}&lt;<span class=declare-param-type>${$2}</span>&gt;`;
        });
    }
    if (matchNormalType$1.test(s)) {
        return s.replace(matchNormalType$1, ($, $1, $2) => {
            if (!$1) {
                return `:<span class=declare-param-type>${$2}</span>`;
            }
            return `<span class=declare-param>${$1}</span>:<span class=declare-param-type>${$2}</span>`;
        });
    }
    return s;
}
function parseFuntionExecute$1(content) {
    return content.replace(/(\w+)(\s*)\(/g, ($, $1, $2) => `<span class=declare-func-execute>${$1}</span>${$2}(`);
}
function parseDeclareConstant$1(text) {
    return text.replace(/(const|let|var|int|string|Byte\[?\]?|[A-Z]+)(\s+)/gi, ($, $1, $2) => {
        return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>`;
    });
}
function parseOperatorChar$1(text) {
    if (isSpecLineComments(text)) {
        return parseSpecComents$1(text);
    }
    return text.replace(/(class|in|of|this|super|interface|module|import|from|extends|new|abstract|void|static|return|break|continue|switch|case|finally|try|catch|else|if|throw)(?=[\s\(\.])/g, ($, $1) => {
        return `<span class=declare-operator-char>${$1}</span>`;
    });
}
// 单行注释
function parseSingleComments$1(text) {
    return `<span class=declare-comments>${text}</span>`;
}
// 处理/* */ 类型注释
function parseSpecComents$1(text) {
    return text.replace(matchSpecComments, ($) => {
        return `<span class=declare-comments>${$}</span>`;
    });
}

function parseTSSyntax(content, line, options) {
    let template = '';
    let s = content.split('\n');
    for (let i = 0; i < s.length; i++) {
        let sub = s[i];
        template += analysisOfGrammar(native(sub), line++, options);
    }
    return template;
}
// 语法分析
function analysisOfGrammar(s, line, options) {
    let st = [], tmpStr = '', l = 0, res = '';
    for (let i = 0; i < s.length; i++) {
        if (s[i] == ")") {
            let cur = '';
            while (st.length && (cur = st.pop()) != '(') {
                tmpStr = cur + tmpStr;
            }
            if (cur != '(') {
                // 换行缺少开括号
                st.push(processParcel(tmpStr + ')', false));
            }
            else {
                l--;
                st.push(processParcel(tmpStr, true));
            }
            tmpStr = '';
        }
        else {
            s[i] == "(" && l++;
            st.push(s[i]);
        }
    }
    let last = 0;
    while (l--) {
        last = st.lastIndexOf("(");
        res = "(" + processParcel(st.slice(last + 1).join(""), false) + res;
        st = st.slice(0, last);
    }
    if (st.length) {
        res = processParcel(st.join(""), false) + res;
    }
    return `<p>${lineNumber(line, options.lineNumber)}<span>${res}</span></p>`;
}
function processParcel(inner, parcel) {
    if (!inner.trim()) {
        return parcel ? `(${inner})` : inner;
    }
    // 是否是注释
    if (isComments(inner.trim())) {
        return parseSingleComments(inner);
    }
    let result = inner;
    result = parseSpecComents(result);
    result = parseParcelData(result);
    result = parseOperatorChar(result);
    result = parseString(result);
    result = parseArrowFunction(result);
    result = parseFuntionExecute(result);
    result = parseFuntion(result);
    result = parseBoolean(result);
    result = parseNumber(result);
    result = parseNull(result);
    return parcel ? `(${result})` : result;
}
function parseParcelData(content) {
    // filter expression syntax
    // match default value not undefiend
    if (/^(const|int|string|var|let)/.test(content.trim())) {
        if (/(\w+\s+)(.*\s*)=(.*)/.test(content)) {
            return content.replace(/(\s*\w+\s+)(.*\s*)=(.*)/, ($, $1, $2, $3) => {
                return `${parseDeclareConstant($1)}${parserSubContent($2)}=${parseParcelData($3)}`;
            });
        }
        // match default value is undefiend
        if (/(\w+\s+)(.*\s*)/.test(content)) {
            return content.replace(/(\s*\w+\s+)(.*\s*)/, ($, $1, $2, $3) => {
                return `${parseDeclareConstant($1)}${parserSubContent($2)}`;
            });
        }
    }
    // process default 
    let result = '';
    let datas = content.split(",");
    for (let i = 0, n = datas.length; i < n; i++) {
        result += `${parserSubContent(datas[i])}${isNeedEndChar(i, n, ',')}`;
    }
    return result;
}
const matchNormalType = /(\s*\w+\s*)?:(\s*\w+\s*)/g, matchGenericType = /(:\s*\w+\s*)?&lt;(\s*\/?\s*\w+\s*)&gt;/g;
function parserSubContent(s) {
    if (matchGenericType.test(s)) {
        return s.replace(matchGenericType, ($, $1, $2) => {
            let rest = $1 ? `<span class=declare-param-type>${$1}</span>` : '';
            return `${rest}&lt;<span class=declare-param-type>${$2}</span>&gt;`;
        });
    }
    if (matchNormalType.test(s)) {
        return s.replace(matchNormalType, ($, $1, $2) => {
            if (!$1) {
                return `:<span class=declare-param-type>${$2}</span>`;
            }
            return `<span class=declare-param>${$1}</span>:<span class=declare-param-type>${$2}</span>`;
        });
    }
    if (isFuntionKeyWord(s)) {
        return parseFuntion(s);
    }
    return s;
}
function parseFuntion(s) {
    return s.replace(matchFunction, ($, $1, $2) => {
        return `<span class=declare-function>${$1}</span>${$2}`;
    });
}
function parseArrowFunction(content) {
    if (!content.includes("=>")) {
        return content;
    }
    return content.replace(/=>/g, ($) => `<span class=declare-arrow-func>${$}</span>`);
}
function parseFuntionExecute(content) {
    return content.replace(/(\w+)(\s*)\(/g, ($, $1, $2) => `<span class=declare-func-execute>${$1}</span>${$2}(`);
}
function parseDeclareConstant(text) {
    // byte\[?\]?
    return text.replace(/(const|let|var|int|string)(\s+)/gi, ($, $1, $2) => {
        return `<span class=declare-keyword>${$1}</span><span class=declare-constant-name>${$2}</span>`;
    });
}
function parseOperatorChar(text) {
    if (isSpecLineComments(text)) {
        return parseSpecComents(text);
    }
    return text.replace(/(class|in|of|this|super|interface|typeof|module|declare|type|keyof|infer|export\s+default|export|import|from|extends|new|abstract|void|static|return|break|continue|switch|case|finally|try|catch|else|if|throw)(?=[\s\(\.])/g, ($, $1) => {
        return `<span class=declare-operator-char>${$1}</span>`;
    });
}
// 单行注释
function parseSingleComments(text) {
    return `<span class=declare-comments>${text}</span>`;
}
// 处理/* */ 类型注释
function parseSpecComents(text) {
    return text.replace(matchSpecComments, ($) => {
        return `<span class=declare-comments>${$}</span>`;
    });
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
};

/**
 * 这里暂时只处理了脚本和html，后续会考虑继续增加。。(除了标记语言，所有语言都是统一进行处理的)
 * @param templates md切割后的模版
 * @param i 当前开始处理位置
 * @param templateLength 模板的总长度
 * @returns 解析后的带语法高亮的代码块
 */
function parseCode(templates, i, templateLength, options) {
    // console.log(templates)
    let result = '', language = templates[i].slice(3).trim().toLowerCase(), line = 1;
    ++i;
    while (i < templateLength && !templates[i].startsWith("```")) {
        result += options.highlight ? languages[language](templates[i], line++, options) : templates[i] + '\n';
        i++;
    }
    // 以防下次进入, 结束标志
    templates[i] = '';
    return { startIdx: i, result: !options.highlight ? `<pre><code>${result}</code></pre>` : `<pre><span class=language>${language}</span><code>${result}</code></pre>` };
}

function parseNoOrderList(templates, i, templateLength) {
    let result = '';
    for (; i < templateLength; i++) {
        if (!templates[i].trim()) {
            continue;
        }
        if (templates[i].trim()[0] === '-' && templates[i].indexOf("-") != -1) {
            result += templates[i] + '\n';
        }
        else {
            break;
        }
    }
    result = processNoOrderList(result);
    return { startIdx: i, result };
}
function processNoOrderList(template) {
    const list = template.match(/(\s?)+-\s(.*)/g);
    if (!list) {
        return template;
    }
    processForamt(list);
    const nodes = genListHelper$1(list);
    const root = genTemplateStringOfNodes(nodes, false);
    return root;
}
function genListHelper$1(list) {
    const results = [], currentOperStack = [], n = list.length;
    for (let i = 0; i < n; i++) {
        const level = list[i].indexOf("-");
        const listItem = { children: [], value: list[i].slice(level + 1), level, parent: null };
        if (!currentOperStack.length) {
            results.push(listItem);
            currentOperStack.push(listItem);
            continue;
        }
        const topLevel = currentOperStack[currentOperStack.length - 1].level;
        const curLevel = list[i].indexOf("-");
        let parent;
        if (topLevel === curLevel) {
            parent = currentOperStack[currentOperStack.length - 1].parent;
        }
        else {
            if (topLevel > curLevel) {
                while (currentOperStack[currentOperStack.length - 1].level > curLevel) {
                    currentOperStack.pop();
                }
                parent = currentOperStack[currentOperStack.length - 1].parent;
            }
            else {
                parent = currentOperStack[currentOperStack.length - 1];
            }
        }
        listItem.parent = parent;
        parent ? parent.children.push(listItem) : results.push(listItem);
        currentOperStack.push(listItem);
    }
    return results;
}

function parseOrderList(templates, i, templateLength) {
    let result = '';
    for (; i < templateLength; i++) {
        if (!templates[i].trim()) {
            continue;
        }
        if (matchOrderList.test(templates[i])) {
            result += templates[i] + '\n';
        }
        else {
            break;
        }
    }
    result = processOrderList(result);
    return { startIdx: i, result };
}
function processOrderList(template) {
    const list = template.match(/\s*\d\.(.*)/g);
    if (!list) {
        return template;
    }
    processForamt(list);
    const nodes = genListHelper(list);
    const root = genTemplateStringOfNodes(nodes, true);
    return root;
}
function genListHelper(list) {
    const results = [], currentOperStack = [], n = list.length;
    for (let i = 0; i < n; i++) {
        let level = 0;
        if (matchOrderList.test(list[i])) {
            level = list[i].indexOf(String(RegExp.$1 + "."));
        }
        const listItem = { children: [], value: list[i].slice(level + 2), level, parent: null };
        if (!currentOperStack.length) {
            results.push(listItem);
            currentOperStack.push(listItem);
            continue;
        }
        const topLevel = currentOperStack[currentOperStack.length - 1].level;
        const curLevel = level;
        let parent;
        if (topLevel === curLevel) {
            parent = currentOperStack[currentOperStack.length - 1].parent;
        }
        else {
            if (topLevel > curLevel) {
                while (currentOperStack[currentOperStack.length - 1].level > curLevel) {
                    currentOperStack.pop();
                }
                parent = currentOperStack[currentOperStack.length - 1].parent;
            }
            else {
                parent = currentOperStack[currentOperStack.length - 1];
            }
        }
        listItem.parent = parent;
        parent ? parent.children.push(listItem) : results.push(listItem);
        currentOperStack.push(listItem);
    }
    return results;
}

function getTitleLevel(level) {
    return level.length > 6 ? 6 : level.length;
}
function parseTitle(s) {
    return s.trim().replace(matchTitle, ($1, $2, $3) => {
        return `<h${getTitleLevel($2)}>${parseNormalText($3, true)}</h${getTitleLevel($2)}>`;
    });
}

function parseTable(templates, i, templateLength) {
    let result = '<table>';
    // 处理标题
    result += processTableTHead(templates[i]);
    result += `<tbody >`;
    ++i;
    for (; i < templateLength; i++) {
        if (templates[i].trim()[0] === '|') {
            result += processTabletBody(templates[i]);
        }
        else {
            break;
        }
    }
    result += `</tbody></table>`;
    return { startIdx: i - 1, result };
}
function processTableTHead(s) {
    let preIdx = -1, template = '<thead><tr>';
    for (let i = 0, n = s.length; i < n; i++) {
        if (s[i] == '|' && isValidedSplitChar(s, i - 1) && isValidedSplitChar(s, i + 1)) {
            if (preIdx != -1) {
                template += `<th>${s.slice(preIdx + 1, i)}</th>`;
            }
            preIdx = i;
        }
    }
    return template + `</tr></thead>`;
}
function processTabletBody(s) {
    let preIdx = -1, template = '<tr>';
    for (let i = 0, n = s.length; i < n; i++) {
        if (s[i] == '|' && isValidedSplitChar(s, i - 1) && isValidedSplitChar(s, i + 1)) {
            if (preIdx != -1) {
                let cnts = s.slice(preIdx + 1, i);
                if (cnts.trim()[0] === '-') {
                    continue;
                }
                template += `<td>${cnts}</td>`;
            }
            preIdx = i;
        }
    }
    return template + `</tr>`;
}
function isValidedSplitChar(s, i) {
    return s[i] === ' ' || s[i] == undefined;
}

function parseLayout(templates, i, templateLength) {
    let result = `<div class=flex-layout>`, tmpS = '';
    ++i;
    while (i < templateLength && !isMultColumnEnd(templates[i])) {
        if (isMultColumn(templates[i])) {
            result += `<div class=flex-layout-item>${markdownToHTML(tmpS)}</div>`;
            tmpS = '';
        }
        else {
            tmpS += templates[i].trim() ? templates[i] + '\n' : '';
        }
        i++;
    }
    result += `<div class=flex-layout-item>${markdownToHTML(tmpS)}</div>`;
    result += `</div>`;
    return { result, startIdx: i };
}

function parseHeadLayout(templates, i, templateLength) {
    let resultStr = `<div class=head-layout>`;
    ++i;
    while (i < templateLength && !isHeadLayoutEnd(templates[i])) {
        if (isMultColumnStart(templates[i])) {
            const { startIdx, result } = parseLayout(templates, i, templateLength);
            resultStr += result;
            i = startIdx + 1;
        }
        else {
            resultStr += templates[i].trim() ? markdownToHTML(templates[i]) : '';
            i++;
        }
    }
    resultStr += '</div>';
    return { result: resultStr, startIdx: i };
}

const defaultOptions = {
    lineNumber: false,
    highlight: false
};
function markdownToHTML(template, options) {
    const templates = template.split('\n');
    let templateStr = '', len = (templates === null || templates === void 0 ? void 0 : templates.length) || 0;
    for (let i = 0; i < len;) {
        if (isTitle(templates[i])) {
            // 说明为标题
            templateStr += parseTitle(templates[i]);
        }
        else if (isHeadLayoutStart(templates[i])) {
            const { result, startIdx } = parseHeadLayout(templates, i, len);
            i = startIdx;
            templateStr += result;
        }
        else if (isMultColumnStart(templates[i])) {
            const { result, startIdx } = parseLayout(templates, i, len);
            // 重置开始检索的位置
            i = startIdx;
            // 将解析得到的结果进行拼接
            templateStr += result;
        }
        else if (isTable(templates[i])) {
            const { result, startIdx } = parseTable(templates, i, len);
            // 重置开始检索的位置
            i = startIdx;
            // 将解析得到的结果进行拼接
            templateStr += result;
        }
        else if (isNoOrderList(templates[i])) {
            // 说明为无序列表
            const { result, startIdx } = parseNoOrderList(templates, i, len);
            // 这里进入了当前分支 下面就不会走了 防止这个选项漏掉 那么我们需要回退一步 下面处理有序列表也是一样的
            // （分支处理结构引出的问题）
            i = startIdx - 1;
            templateStr += result;
        }
        else if (isOrderList(templates[i])) {
            // 说明为有序列表
            const { result, startIdx } = parseOrderList(templates, i, len);
            i = startIdx - 1;
            templateStr += result;
        }
        else if (isPreCode(templates[i])) {
            // 代码块
            const { result, startIdx } = parseCode(templates, i, len, options || defaultOptions);
            i = startIdx;
            templateStr += result;
        }
        else if (isBLock(templates[i])) {
            // 说明为代码块
            templateStr += parseBlock(templates[i]);
        }
        else {
            // 处理普通文字
            if (templates[i] = templates[i].trim()) {
                templateStr += parseNormalText(templates[i]);
            }
        }
        i++;
    }
    return templateStr;
}

export { markdownToHTML };
