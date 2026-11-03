// Generates both grammars from one shared JS repository. Run: node build.mjs
// NOTE: regexes use String.raw so backslashes (\b, \w, \*, \d) reach the JSON intact.
import { writeFileSync } from 'node:fs'
const r = String.raw
const js = {
  patterns: [
    { name: 'comment.block', begin: r`/\*`, end: r`\*/` },
    { name: 'comment.line.double-slash', match: r`//.*$` },
    { name: 'string.quoted.double', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape', match: r`\\.` }] },
    { name: 'string.quoted.single', begin: "'", end: "'", patterns: [{ name: 'constant.character.escape', match: r`\\.` }] },
    { name: 'constant.numeric', match: r`\b(0[xX][0-9a-fA-F]+|\d+(\.\d+)?)\b` },
    { name: 'constant.language', match: r`\b(true|false|null|undefined|NaN|Infinity)\b` },
    { name: 'keyword.control', match: r`\b(if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|in|with)\b` },
    { name: 'keyword.control.new', match: r`\b(new|delete|typeof|instanceof|void)\b` },
    { name: 'storage.type', match: r`\b(var|function)\b` },
    { name: 'variable.language', match: String.raw`\bthis\b` },
  ],
}
const xml = {
  comments: { patterns: [{ name: 'comment.block.xml', begin: '<!--', end: '-->' }] },
  cdata: { beginCaptures: { 0: { name: 'punctuation.definition.tag' } }, endCaptures: { 0: { name: 'punctuation.definition.tag' } }, begin: r`<!\[CDATA\[`, end: r`\]\]>`, patterns: [{ include: '#js' }] },
  script: {
    begin: r`(<)(Script)(\b[^>]*)(>)`,
    beginCaptures: { 1: { name: 'punctuation.definition.tag' }, 2: { name: 'entity.name.tag' }, 3: { patterns: [{ include: '#attrs' }] }, 4: { name: 'punctuation.definition.tag' } },
    end: r`(</)(Script)(>)`,
    endCaptures: { 1: { name: 'punctuation.definition.tag' }, 2: { name: 'entity.name.tag' }, 3: { name: 'punctuation.definition.tag' } },
    patterns: [{ include: '#cdata' }, { include: '#js' }],
  },
  tag: {
    begin: r`(</?)([\w:.-]+)`,
    beginCaptures: { 1: { name: 'punctuation.definition.tag' }, 2: { name: 'entity.name.tag' } },
    end: r`/?>`,
    endCaptures: { 0: { name: 'punctuation.definition.tag' } },
    patterns: [{ include: '#attrs' }],
  },
  attrs: {
    patterns: [
      { match: r`([\w:.-]+)(=)`, captures: { 1: { name: 'entity.other.attribute-name' }, 2: { name: 'punctuation.separator.key-value' } } },
      { name: 'string.quoted.double.xml', begin: '"', end: '"', patterns: [{ name: 'constant.character.entity', match: r`&[#\w]+;` }, { name: 'variable.other.binding', match: r`@\w+` }] },
      { name: 'string.quoted.single.xml', begin: "'", end: "'" },
    ],
  },
  js,
}
const xmlGrammar = {
  scopeName: 'source.nexacro.xml',
  patterns: [
    { name: 'meta.tag.preprocessor.xml', begin: r`<\?`, end: r`\?>` },
    { include: '#comments' }, { include: '#script' }, { include: '#cdata' }, { include: '#tag' },
  ],
  repository: xml,
}
const jsGrammar = { scopeName: 'source.nexacro.script', patterns: [{ include: '#js' }], repository: { js } }
writeFileSync('syntaxes/nexacro-xml.tmLanguage.json', JSON.stringify(xmlGrammar, null, 2))
writeFileSync('syntaxes/nexacro-script.tmLanguage.json', JSON.stringify(jsGrammar, null, 2))
