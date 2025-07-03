import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "strings",
  title: "Strings and StringBuilders",
  content: <>
    <p>
      Strings are immutable sequences of characters which can be used to send and receive text message bodies.
    </p>
    <p>
      Although Tact provides various support for working with strings, they are quite gas-expensive and not recommended to be used in production contracts.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Strings() {
    get fun showcase() {
        // String literals are wrapped in double-quotes and can contain escape sequences,
        // but they intentionally cannot be concatenated via any operators.
        let str: String = "I am a string literal, 👻!";

        // Strings are useful for storing text,
        // so they can be converted to a Cell type to be used as message bodies.
        let noComments: Cell = "yes comments".asComment(); // prefixes a string with 32 zero bits

        // Compose and concatenate strings with a StringBuilder
        let sb: StringBuilder = beginString()
            .concat("Hello, ")
            .concat("World!");
        sb.toString(); // "Hello, World!"
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
