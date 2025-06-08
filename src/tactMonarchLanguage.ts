import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

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
        // { "include": "@annotation" }, // TODO
        { "include": "@literal" },
        // { "include": "@invalid" }, // TODO
        // { "include": "@constant" }, // TODO
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
        [/"/, "string", "@string"],
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
      type: [
        { "include": "@simple_type" },
        // TODO: map, bounced, as-tlb
      ],
      simple_type: [
        {
          "regex": "(?<!\\.)\\b([A-Z][a-zA-Z0-9_]*)(\\??)",
          "action": ["type.identifier.tact", "keyword.operator.optional.tact"],
        }
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
          "regex": "(\\+=|-=|\\*=|/=|%=|\\^=|&=|\\|=|<<=|>>=)",
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
          // TODO: revisit this one:
          "regex": "([?:])",
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
        {
          "regex": "(?<!\\.)\\b(as)\\b",
          "action": "keyword.other.as.tact storage.modifier.tact"
        },
        {
          "regex": "(?<!\\.)\\b(struct)\\b",
          "action": "keyword.other.struct.tact"
        },
        {
          "regex": "(?<!\\.)\\b(message)\\b",
          "action": "keyword.other.message.tact"
        },
        {
          "regex": "(?<!\\.)\\b(trait)\\b",
          "action": "keyword.other.trait.tact"
        },
        {
          "regex": "(?<!\\.)\\b(contract)\\b",
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
          // "action": ["entity.name.function.tact", "punctuation.brackets.round.tact"],
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
          // "action": "nothing.tact"
          // "action": "variable.other.tact"
        }
      ],
    },
  };
};

// TODO: convert all into Monarch definition.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RemainingToConvert = `
{
  "name": "tact",
  "scopeName": "source.tact",
  "fileTypes": ["tact"],
  "patterns": [
    { "include": "#annotation" },
    { "include": "#invalid" },
    { "include": "#constant" },
  ],
  "repository": {
    "annotation": {
      "patterns": [
        {
          "comment": "@name() in native functions",
          "begin": "^\\s*(@name)\\s*(\\()",
          "beginCaptures": {
            "1": {
              "name": "entity.other.attribute-name.tact"
            },
            "2": {
              "name": "punctuation.brackets.round.tact"
            }
          },
          "patterns": [
            {
              "comment": "FunC identifier",
              "match": "(.*?)",
              "name": "entity.name.function.func.tact"
            }
          ],
          "end": "\\)",
          "endCaptures": {
            "0": {
              "name": "punctuation.brackets.round.tact"
            }
          }
        },
        {
          "comment": "One or more @interface() before traits and contracts",
          "begin": "(?<!\\.)(@interface)\\s*(\\()",
          "beginCaptures": {
            "1": {
              "name": "entity.other.attribute-name.tact"
            },
            "2": {
              "name": "punctuation.brackets.round.tact"
            }
          },
          "patterns": [
            {
              "include": "#string"
            }
          ],
          "end": "\\)",
          "endCaptures": {
            "0": {
              "name": "punctuation.brackets.round.tact"
            }
          }
        },
        {
          "comment": "Asm arrangements",
          "begin": "(?<!\\.)(asm)\\s*(\\()",
          "beginCaptures": {
            "1": {
              "name": "keyword.other.asm.tact"
            },
            "2": {
              "name": "punctuation.brackets.round.tact"
            }
          },
          "patterns": [
            {
              "include": "#variable"
            },
            {
              "match": "->",
              "name": "keyword.operator.mapsto.tact"
            },
            {
              "comment": "Decimal integer WITH leading zero",
              "match": "\\b(0[0-9]*)\\b",
              "name": "constant.numeric.decimal.tact"
            },
            {
              "comment": "Decimal integer WITHOUT leading zero",
              "match": "\\b([1-9](?:_?[0-9])*)\\b",
              "name": "constant.numeric.decimal.tact"
            }
          ],
          "end": "\\)",
          "endCaptures": {
            "0": {
              "name": "punctuation.brackets.round.tact"
            }
          }
        },
        {
          "comment": "Fallback match",
          "match": "(?<!\\.)\\b(@name|@interface)\\b",
          "name": "entity.other.attribute-name.tact"
        },
        {
          "comment": "Fallback match",
          "match": "(?<!\\.)\\b(asm)\\b",
          "name": "keyword.other.asm.tact"
        }
      ]
    },

    "invalid": {
      "patterns": [
        {
          "comment": "Anything starting with __gen or __tact",
          "match": "\\b__(?:gen|tact)[a-zA-Z0-9_]*\\b",
          "name": "invalid.illegal.identifier.tact"
        }
      ]
    },

    "constant": {
      "patterns": [
        {
          "comment": "self.storageReserve",
          "match": "(?<=self\\.)(storageReserve)\\b",
          "name": "constant.other.builtin.tact"
        },
        {
          "comment": "Other constants from the core library",
          "match": "(?<!\\.)\\b(SendDefaultMode|SendRemainingValue|SendRemainingBalance|SendPayGasSeparately|SendIgnoreErrors|SendBounceIfActionFail|SendDestroyIfZero|SendOnlyEstimateFee|ReserveExact|ReserveAllExcept|ReserveAtMost|ReserveAddOriginalBalance|ReserveInvertSign|ReserveBounceIfActionFail)\\b",
          "name": "constant.other.builtin.tact"
        },
        {
          "comment": "ALL CAPS constants",
          "match": "\\b([A-Z]{2}[A-Z0-9_]*)\\b",
          "name": "constant.other.caps.tact"
        },
        {
          "comment": "Constant declaration or definition",
          "match": "(?<!\\.)\\b(const)\\s+([a-zA-Z_][A-Za-z0-9_]*)\\b",
          "captures": {
            "1": {
              "name": "keyword.other.tact"
            },
            "2": {
              "name": "constant.other.declaration.tact"
            }
          }
        },
        {
          "comment": "null",
          "match": "(?<!\\.)\\b(null)\\b",
          "name": "constant.language.null.tact"
        }
      ]
    },

    "type": {
      "patterns": [
        {
          "include": "#simple-type"
        },
        {
          "comment": "bounced<T>",
          "begin": "(?<!\\.)\\b(bounced)\\s*(<)",
          "beginCaptures": {
            "1": {
              "name": "entity.name.type.tact"
            },
            "2": {
              "name": "punctuation.brackets.angle.tact"
            }
          },
          "patterns": [
            {
              "include": "#simple-type"
            }
          ],
          "end": ">",
          "endCaptures": {
            "0": {
              "name": "punctuation.brackets.angle.tact"
            }
          }
        },
        {
          "comment": "map<K, V>",
          "begin": "(?<!\\.)\\b(map)\\s*(<)",
          "beginCaptures": {
            "1": {
              "name": "entity.name.type.tact"
            },
            "2": {
              "name": "punctuation.brackets.angle.tact"
            }
          },
          "patterns": [
            {
              "include": "#simple-type"
            },
            {
              "match": ",",
              "name": "punctuation.comma.tact"
            },
            {
              "include": "#as-tlb"
            }
          ],
          "end": ">",
          "endCaptures": {
            "0": {
              "name": "punctuation.brackets.angle.tact"
            }
          }
        },
        {
          "include": "#as-tlb"
        }
      ]
    },

    "simple-type": {
      "comment": "Simple types",
      "match": "(?<!\\.)\\b([A-Z][a-zA-Z0-9_]*)(\\??)",
      "captures": {
        "1": {
          "name": "entity.name.type.tact"
        },
        "2": {
          "name": "keyword.operator.optional.tact"
        }
      }
    },

    "as-tlb": {
      "comment": "Serialization",
      "patterns": [
        {
          "match": "(?<!\\.)\\b(as)\\s+(coins|varu?int(?:32|16)|remaining|bytes(?:32|64)|int257|u?int(?:25[0-6]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?))\\b",
          "captures": {
            "1": {
              "name": "keyword.other.as.tact storage.modifier.tact"
            },
            "2": {
              "name": "entity.name.type.tact"
            }
          }
        }
      ]
    },

    "expression": {
      "patterns": [
        {
          "comment": "Ternary expression",
          "begin": "(?!\\?\\.\\s*[^[:digit:]])(\\?)(?!\\?)",
          "beginCaptures": {
            "1": {
              "name": "keyword.operator.ternary.tact"
            }
          },
          "patterns": [
            {
              "include": "$self"
            }
          ],
          "end": "\\s*(:)",
          "endCaptures": {
            "1": {
              "name": "keyword.operator.ternary.tact"
            }
          }
        }
      ]
    },

  }
}
`;
