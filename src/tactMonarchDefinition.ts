import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// NOTE: Lookbehinds don't work as they do in TextMate
export default function tactMonarchDefinition(): monaco.languages.IMonarchLanguage {
  return {
    defaultToken: "",
    brackets: [
      { open: "{", close: "}", token: "punctuation.brackets.curly" },
      { open: "(", close: ")", token: "punctuation.brackets.round" },
    ],
    tokenizer: {
      patterns: [
        { "include": "@whitespace" },
        { "include": "@annotation" },
        { "include": "@literal" },
        { "include": "@invalid" },
        { "include": "@constant" },
        { "include": "@type" },
        { "include": "@expression" },
        { "include": "@punctuation" },
        { "include": "@keyword" },
        { "include": "@function" },
        { "include": "@variable" }
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        ["\\*/", "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
      annotation: [
        {
          "regex": "^\\s*(@\\\\{0}name\\()([^)]*)(\\))",
          "action": ["annotation", "pragma", "annotation"],
        },
        {
          "regex": "\\s*(@\\\\{0}interface\\()\\s*(\"[^\"]*\")\\s*(\\))",
          "action": ["annotation", "string", "annotation"],
        },
        {
          "regex": "(?<!\\.)\\b(asm)\\b",
          "action": {
            "token": "keyword.other.asm",
            "next": "@asm_arrangement_start",
          },
        },
        // Fallback matches
        {
          "regex": "\\s*(@\\\\{0}(?:name|interface))\\b",
          "action": "annotation",
        },
        {
          "regex": "(?<!\\.)\\b(asm)\\b",
          "action": "keyword.other.asm",
        },
      ],
      asm_arrangement_start: [
        {
          "regex": "\\(",
          "action": {
            "token": "punctuation.brackets.round",
            "bracket": "@open",
            "next": "@asm_arrangement",
          },
        },
        {
          "regex": ".",
          "action": {
            "token": "@rematch",
            "next": "@pop",
          }
        },
      ],
      asm_arrangement: [
        { "include": "@invalid" },
        { "include": "@variable" },
        {
          "regex": "->",
          "action": "keyword.operator.mapsto"
        },
        {
          "regex": "\\b(0[0-9]*)\\b",
          "action": "constant.numeric.decimal"
        },
        {
          "regex": "\\b([1-9](?:_?[0-9])*)\\b",
          "action": "constant.numeric.decimal"
        },
        {
          "regex": "\\)",
          "action": {
            "token": "punctuation.brackets.round",
            "bracket": "@close",
            "next": "@pop",
          },
        },
      ],
      literal: [
        {
          "regex": "\\b(0[xX][a-fA-F0-9](?:_?[a-fA-F0-9])*)\\b",
          "action": "constant.numeric.hex"
        },
        {
          "regex": "\\b(0[oO][0-7](?:_?[0-7])*)\\b",
          "action": "constant.numeric.oct"
        },
        {
          "regex": "\\b(0[bB][01](?:_?[01])*)\\b",
          "action": "constant.numeric.bin"
        },
        {
          "regex": "\\b(0[0-9]*)\\b",
          "action": "constant.numeric.decimal"
        },
        {
          "regex": "\\b([1-9](?:_?[0-9])*)\\b",
          "action": "constant.numeric.decimal"
        },
        {
          "regex": "(?<!\\.)\\b(true|false)\\b",
          "action": "constant.language.bool"
        },
        {
          "regex": "\"",
          "action": {
            "token": "string",
            "next": "@string",
          }
        },
        {
          "regex": "(?<!\\.)\\b(self)\\b",
          "action": "variable.language.this"
        },
      ],
      string: [
        [/[^\\"]+/, "string"],
        {
          "regex": "(?:\\\\)(?:(\\\\)|(\")|([nrtvbf])|(x[a-fA-F0-9]{2})|(u[a-fA-F0-9]{4})|(u\\{[a-fA-F0-9]{1,6}\\}))",
          "action": "string.escape",
        },
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"]
      ],
      invalid: [{
        "regex": "\\b__(?:gen|tact)[a-zA-Z0-9_]*\\b",
        "action": "invalid.illegal.identifier",
      }],
      constant: [
        {
          "regex": "(?<=self\\.)(storageReserve)\\b",
          "action": "constant.other.builtin"
        },
        {
          "regex": "(?<!\\.)\\b(SendDefaultMode|SendRemainingValue|SendRemainingBalance|SendPayGasSeparately|SendPayFwdFeesSeparately|SendIgnoreErrors|SendBounceIfActionFail|SendDestroyIfZero|SendOnlyEstimateFee|ReserveExact|ReserveAllExcept|ReserveAtMost|ReserveAddOriginalBalance|ReserveInvertSign|ReserveBounceIfActionFail|TactExitCodeNullReferenceException|TactExitCodeInvalidSerializationPrefix|TactExitCodeInvalidIncomingMessage|TactExitCodeConstraintsError|TactExitCodeAccessDenied|TactExitCodeContractStopped|TactExitCodeInvalidArgument|TactExitCodeContractCodeNotFound|TactExitCodeInvalidStandardAddress|TactExitCodeNotBasechainAddress)\\b",
          "action": "constant.other.builtin"
        },
        {
          "regex": "\\b([A-Z]{2}[A-Z0-9_]*)\\b",
          "action": "constant.other.caps"
        },
        {
          "regex": "(?<!\\.)\\b(const)\\s+([a-zA-Z_][A-Za-z0-9_]*)\\b",
          "action": ["keyword.other", "constant.other.declaration"]
        },
        {
          "regex": "(?<!\\.)\\b(null)\\b",
          "action": "constant.language.null"
        }
      ],
      type: [
        { "include": "@type_simple" },
        {
          "regex": "(?<!\\.)\\b(bounced|map|set)\\b",
          "action": {
            "token": "type.identifier",
            "next": "@type_generic_start",
          },
        },
      ],
      type_simple: [
        {
          "regex": "(?<!\\.)\\b([A-Z][a-zA-Z0-9_]*)(\\??)",
          "action": ["type.identifier", "keyword.operator.optional"],
        },
        { "include": "@as" },
      ],
      type_generic_start: [
        {
          "regex": "<",
          "action": {
            "token": "punctuation.brackets.angle",
            "bracket": "@open",
            "next": "@type_generic",
          },
        },
        {
          "regex": ".",
          "action": { "token": "@rematch", "next": "@pop" },
        },
      ],
      type_generic: [
        { "include": "@type_simple" },
        { "include": "@as" },
        {
          "regex": ",",
          "action": "punctuation.comma"
        },
        {
          "regex": ">",
          "action": {
            "token": "punctuation.brackets.angle",
            "bracket": "@close",
            "next": "@pop",
          },
        },
      ],
      as: [
        {
          "regex": "(?<!\\.)\\b(as)\\b",
          "action": {
            "token": "keyword.other.as.tact storage.modifier",
            "switchTo": "@as_tlb",
            // NOTE: switchTo makes a smaller chunk of the code lose colors
            // when there are any issues with the serialization format given
          },
        },
      ],
      as_tlb: [
        {
          "regex": "\\b(coins|varu?int(?:32|16)|remaining|bytes(?:32|64)|int257|u?int(?:25[0-6]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?))\\b",
          "action": { "token": "type.identifier", "switchTo": "@patterns" },
        },
      ],
      expression: [
        {
          "regex": "(\\|\\||&&|!!?)(?!=)",
          "action": "keyword.operator.logical"
        },
        {
          "regex": "(\\^|&|\\||~|<<|>>)(?!=)",
          "action": "keyword.operator.bitwise"
        },
        {
          "regex": "(\\+=|-=|\\*=|/=|%=|\\^=|&=|\\|=|\\|\\|=|&&=|<<=|>>=)",
          "action": "keyword.operator.assignment"
        },
        {
          "regex": "(?<![<>])=(?!=)",
          "action": "keyword.operator.assignment.equal"
        },
        {
          "regex": "([!=]=|<=?|>=?)",
          "action": "keyword.operator.comparison"
        },
        {
          "regex": "([+%*\\-])|(/(?!/))",
          "action": "keyword.operator.arithmetic"
        },
        {
          "regex": "\\b(initOf)\\b",
          "action": "keyword.operator.new"
        },
        {
          "regex": "\\b(codeOf)\\b",
          "action": "keyword.operator.new"
        },
        {
          "regex": "(?!\\?\\.\\s*[^[:digit:]])(\\?)(?!\\?)",
          "action": "keyword.operator.ternary",
        },
      ],
      punctuation: [
        {
          "regex": ",",
          "action": "punctuation.comma"
        },
        {
          "regex": "[{}]",
          "action": "punctuation.brackets.curly"
        },
        {
          "regex": "[()]",
          "action": "punctuation.brackets.round"
        },
        {
          "regex": ";",
          "action": "punctuation.semi"
        },
        {
          "regex": ":",
          "action": "punctuation.colon"
        },
        {
          "regex": "\\.",
          "action": "punctuation.dot"
        }
      ],
      keyword: [
        {
          "regex": "(?<!\\.)\\b(import)\\b",
          "action": "keyword.control.import"
        },
        {
          "regex": "(?<=\\.\\.)\\b(else|catch|until|in(?!\\s*\\())\\b",
          "action": "keyword.control"
        },
        {
          "regex": "(?<!\\.)\\b(if|else|try|catch|repeat|do|until|while|foreach|in(?!\\s*\\()|return)\\b",
          "action": "keyword.control"
        },
        {
          "regex": "(?<!\\.)\\b(let|const)\\b",
          "action": "keyword.other"
        },
        // NOTE: `as` keyword has its own rule: "@as"
        {
          "regex": "(?<!\\.)\\b(struct)\\b(?!\\s*:)",
          "action": "keyword.other.struct"
        },
        {
          "regex": "(?<!\\.)\\b(message)\\b(?!\\s*(?::|\\(\\s*M|\\(\\s*\\)))",
          "action": "keyword.other.message"
        },
        {
          "regex": "(?<!\\.)\\b(trait)\\b(?!\\s*:)",
          "action": "keyword.other.trait"
        },
        {
          "regex": "(?<!\\.)\\b(contract)\\b(?!\\s*:)",
          "action": "keyword.other.contract"
        },
        {
          "regex": "(?<!\\.)\\b(abstract|virtual|override)\\b",
          "action": "keyword.other.attribute.tact storage.modifier"
        },
        {
          "regex": "(?<!\\.)\\b(extends|get|inline|mutates)\\b",
          "action": "keyword.other.attribute"
        },
        {
          "regex": "(?<!\\.)\\b(fun|native)\\b",
          "action": "keyword.other.function"
        },
        {
          "regex": "(?<!\\.)\\b(init|receive|bounced|external)(?=\\s*\\()",
          "action": "keyword.other.function"
        },
        {
          "regex": "(?<!\\.)\\b(extend|public)\\b",
          "action": "keyword.other.reserved"
        },
        {
          "regex": "(?<!\\.)\\b(primitive|with)\\b",
          "action": "keyword.other"
        }
      ],
      function: [
        {
          "regex": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(\\()",
          "action": ["variable", "punctuation.brackets.round"],
          // "entity.name.function"
        }
      ],
      variable: [
        {
          "regex": "(?<!\\.)\\b(_)\\b",
          "action": "comment.unused-identifier"
        },
        {
          "regex": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b",
          "action": "nothing"
          // "variable.other"
        }
      ],
    },
  };
};
