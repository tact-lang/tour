import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// NOTE: Lookbehinds don't work as they do in TextMate
export default function tactMonarchLanguage(): monaco.languages.IMonarchLanguage {
  return {
    defaultToken: "",
    brackets: [
      { open: "{", close: "}", token: "punctuation.brackets.curly.tact" },
      { open: "(", close: ")", token: "punctuation.brackets.round.tact" },
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
            "token": "keyword.other.asm.tact",
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
          "action": "keyword.other.asm.tact",
        },
      ],
      asm_arrangement_start: [
        {
          "regex": "\\(",
          "action": {
            "token": "punctuation.brackets.round.tact",
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
          "action": "keyword.operator.mapsto.tact"
        },
        {
          "regex": "\\b(0[0-9]*)\\b",
          "action": "constant.numeric.decimal.tact"
        },
        {
          "regex": "\\b([1-9](?:_?[0-9])*)\\b",
          "action": "constant.numeric.decimal.tact"
        },
        {
          "regex": "\\)",
          "action": {
            "token": "punctuation.brackets.round.tact",
            "bracket": "@close",
            "next": "@pop",
          },
        },
      ],
      literal: [
        {
          "regex": "\\b(0[xX][a-fA-F0-9](?:_?[a-fA-F0-9])*)\\b",
          "action": "constant.numeric.hex.tact"
        },
        {
          "regex": "\\b(0[oO][0-7](?:_?[0-7])*)\\b",
          "action": "constant.numeric.oct.tact"
        },
        {
          "regex": "\\b(0[bB][01](?:_?[01])*)\\b",
          "action": "constant.numeric.bin.tact"
        },
        {
          "regex": "\\b(0[0-9]*)\\b",
          "action": "constant.numeric.decimal.tact"
        },
        {
          "regex": "\\b([1-9](?:_?[0-9])*)\\b",
          "action": "constant.numeric.decimal.tact"
        },
        {
          "regex": "(?<!\\.)\\b(true|false)\\b",
          "action": "constant.language.bool.tact"
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
          "action": "variable.language.this.tact"
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
        "action": "invalid.illegal.identifier.tact",
      }],
      constant: [
        {
          "regex": "(?<=self\\.)(storageReserve)\\b",
          "action": "constant.other.builtin.tact"
        },
        {
          "regex": "(?<!\\.)\\b(SendDefaultMode|SendRemainingValue|SendRemainingBalance|SendPayGasSeparately|SendPayFwdFeesSeparately|SendIgnoreErrors|SendBounceIfActionFail|SendDestroyIfZero|SendOnlyEstimateFee|ReserveExact|ReserveAllExcept|ReserveAtMost|ReserveAddOriginalBalance|ReserveInvertSign|ReserveBounceIfActionFail|TactExitCodeNullReferenceException|TactExitCodeInvalidSerializationPrefix|TactExitCodeInvalidIncomingMessage|TactExitCodeConstraintsError|TactExitCodeAccessDenied|TactExitCodeContractStopped|TactExitCodeInvalidArgument|TactExitCodeContractCodeNotFound|TactExitCodeInvalidStandardAddress|TactExitCodeNotBasechainAddress)\\b",
          "action": "constant.other.builtin.tact"
        },
        {
          "regex": "\\b([A-Z]{2}[A-Z0-9_]*)\\b",
          "action": "constant.other.caps.tact"
        },
        {
          "regex": "(?<!\\.)\\b(const)\\s+([a-zA-Z_][A-Za-z0-9_]*)\\b",
          "action": ["keyword.other.tact", "constant.other.declaration.tact"]
        },
        {
          "regex": "(?<!\\.)\\b(null)\\b",
          "action": "constant.language.null.tact"
        }
      ],
      type: [
        { "include": "@type_simple" },
        {
          "regex": "(?<!\\.)\\b(bounced|map|set)\\b",
          "action": {
            "token": "type.identifier.tact",
            "next": "@type_generic_start",
          },
        },
      ],
      type_simple: [
        {
          "regex": "(?<!\\.)\\b([A-Z][a-zA-Z0-9_]*)(\\??)",
          "action": ["type.identifier.tact", "keyword.operator.optional.tact"],
        },
        { "include": "@as" },
      ],
      type_generic_start: [
        {
          "regex": "<",
          "action": {
            "token": "punctuation.brackets.angle.tact",
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
          "action": "punctuation.comma.tact"
        },
        {
          "regex": ">",
          "action": {
            "token": "punctuation.brackets.angle.tact",
            "bracket": "@close",
            "next": "@pop",
          },
        },
      ],
      as: [
        {
          "regex": "(?<!\\.)\\b(as)\\b",
          "action": {
            "token": "keyword.other.as.tact storage.modifier.tact",
            // "next": "@as_tlb",
            "switchTo": "@as_tlb",
            // NOTE: switchTo makes a smaller chunk of the code lose colors
            // when there are any issues with the serialization format given
          },
        },
      ],
      as_tlb: [
        {
          "regex": "\\b(coins|varu?int(?:32|16)|remaining|bytes(?:32|64)|int257|u?int(?:25[0-6]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?))\\b",
          "action": { "token": "type.identifier.tact", "next": "@pop", },
        },
      ],
      expression: [
        {
          "regex": "(\\|\\||&&|!!?)(?!=)",
          "action": "keyword.operator.logical.tact"
        },
        {
          "regex": "(\\^|&|\\||~|<<|>>)(?!=)",
          "action": "keyword.operator.bitwise.tact"
        },
        {
          "regex": "(\\+=|-=|\\*=|/=|%=|\\^=|&=|\\|=|\\|\\|=|&&=|<<=|>>=)",
          "action": "keyword.operator.assignment.tact"
        },
        {
          "regex": "(?<![<>])=(?!=)",
          "action": "keyword.operator.assignment.equal.tact"
        },
        {
          "regex": "([!=]=|<=?|>=?)",
          "action": "keyword.operator.comparison.tact"
        },
        {
          "regex": "([+%*\\-])|(/(?!/))",
          "action": "keyword.operator.arithmetic.tact"
        },
        {
          "regex": "\\b(initOf)\\b",
          "action": "keyword.operator.new.tact"
        },
        {
          "regex": "\\b(codeOf)\\b",
          "action": "keyword.operator.new.tact"
        },
        {
          "regex": "(?!\\?\\.\\s*[^[:digit:]])(\\?)(?!\\?)",
          "action": "keyword.operator.ternary.tact",
        },
      ],
      punctuation: [
        {
          "regex": ",",
          "action": "punctuation.comma.tact"
        },
        {
          "regex": "[{}]",
          "action": "punctuation.brackets.curly.tact"
        },
        {
          "regex": "[()]",
          "action": "punctuation.brackets.round.tact"
        },
        {
          "regex": ";",
          "action": "punctuation.semi.tact"
        },
        {
          "regex": ":",
          "action": "punctuation.colon.tact"
        },
        {
          "regex": "\\.",
          "action": "punctuation.dot.tact"
        }
      ],
      keyword: [
        {
          "regex": "(?<!\\.)\\b(import)\\b",
          "action": "keyword.control.import.tact"
        },
        {
          "regex": "(?<=\\.\\.)\\b(else|catch|until|in(?!\\s*\\())\\b",
          "action": "keyword.control.tact"
        },
        {
          "regex": "(?<!\\.)\\b(if|else|try|catch|repeat|do|until|while|foreach|in(?!\\s*\\()|return)\\b",
          "action": "keyword.control.tact"
        },
        {
          "regex": "(?<!\\.)\\b(let|const)\\b",
          "action": "keyword.other.tact"
        },
        // NOTE: `as` keyword has its own rule: "@as"
        {
          "regex": "(?<!\\.)\\b(struct)\\b(?!\\s*:)",
          "action": "keyword.other.struct.tact"
        },
        {
          "regex": "(?<!\\.)\\b(message)\\b(?!\\s*(?::|\\(\\s*M|\\(\\s*\\)))",
          "action": "keyword.other.message.tact"
        },
        {
          "regex": "(?<!\\.)\\b(trait)\\b(?!\\s*:)",
          "action": "keyword.other.trait.tact"
        },
        {
          "regex": "(?<!\\.)\\b(contract)\\b(?!\\s*:)",
          "action": "keyword.other.contract.tact"
        },
        {
          "regex": "(?<!\\.)\\b(abstract|virtual|override)\\b",
          "action": "keyword.other.attribute.tact storage.modifier.tact"
        },
        {
          "regex": "(?<!\\.)\\b(extends|get|inline|mutates)\\b",
          "action": "keyword.other.attribute.tact"
        },
        {
          "regex": "(?<!\\.)\\b(fun|native)\\b",
          "action": "keyword.other.function.tact"
        },
        {
          "regex": "(?<!\\.)\\b(init|receive|bounced|external)(?=\\s*\\()",
          "action": "keyword.other.function.tact"
        },
        {
          "regex": "(?<!\\.)\\b(extend|public)\\b",
          "action": "keyword.other.reserved.tact"
        },
        {
          "regex": "(?<!\\.)\\b(primitive|with)\\b",
          "action": "keyword.other.tact"
        }
      ],
      function: [
        {
          "regex": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(\\()",
          "action": ["variable.tact", "punctuation.brackets.round.tact"],
          // "entity.name.function.tact"
        }
      ],
      variable: [
        {
          "regex": "(?<!\\.)\\b(_)\\b",
          "action": "comment.unused-identifier.tact"
        },
        {
          "regex": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b",
          "action": "nothing.tact"
          // "variable.other.tact"
        }
      ],
    },
  };
};
