module.exports = {
    selfClosingElements: ['img', 'br', 'area', 'base', 'col', 'comman', 'embed', 'hr', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
    lists: ['ul', 'ol'],
    expressionOpeningChar: '{',
    expressionClosingChar: '}',
    expressionSelfClosingChar: ';',
    attrOpeningChar: '[',
    attrClosingChar: ']',
    varChar: '@',
    varAssignmentChar: '=',
    endOfVarAssignmentChar: ';',
    commentChar: '*',
    hiddenCommentChar: '!',
    mixinChar: '+',
    mixinKeyword: 'mixin',
    mixinParameterOpeningChar: '(',
    mixinParameterClosingChar: ')',
    importKeyword: 'import',
    escapeChar: '\\',
    keywords: ['if', 'switch', 'case', 'else', 'else if'],
    tab: '    ',
    doctypeKeyword: 'doctype',
    doctypes: {
        html: '<!DOCTYPE html>',
        strict: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
        transitional: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
        frameset: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
        xml: '<?xml version="1.0" encoding="utf-8" ?>',
        1.1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
        strict1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        transitional1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        frameset1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">'
    },
    defaultShorthandElement: 'div',
    forInKeywords: ['for', 'in'],
    ifKeyword: 'if',
    elseKeyword: 'else',
    ifOperators: ['==', '<=', '>=', '!=', '>', '<', '==='],
    logicOperators: ['!', '&&', '||'],
    parentheses: ['(', ')']
};