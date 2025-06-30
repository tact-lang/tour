import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "expressions",
  title: "Expressions",
  content: <>
    <p>
      TODO
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Expressions() {
    get fun showcase() {
        // Integer literals.
        0; 42; 1_000; 020; // decimal, base 10
        0xABC; 0xf; 0x001; // hexadecimal, base 16
        0o777; 0o00000001; // octal, base 8
        0b111010101111010; // binary, base 2

        // Boolean literals.
        true; false;

        // String literals.
        "You can be The Good Guy or the guy who saves the world... You can't be both.";
        "1234"; // a string, not a number
        "👻"; // strings support Unicode
        "\\ \" \n \r \t \v \b \f \x00 through \xFF"; // common escape sequences
        "\u0000 through \uFFFF and \u{0} through \u{10FFFF}"; // unicode escape sequences

        // \`null\` and \`self\` literals.
        null; // not an instance of a primitive type, but
              // a special value that represents the intentional absence
              // of any other value

        self; // used to reference the current contract from within
              // and the value of the currently extended type inside
              // the extension function. See the "Functions" section below for more.

        // Map literals.
        map<Int, Int as coins> { 11: 11 };

        // Identifiers, with usual naming conventions:
        // They may contain Latin lowercase letters \`a-z\`,
        // Latin uppercase letters \`A-Z\`, underscores \`_\`,
        // and digits 0 - 9, but may not start with a digit.
        // No other symbols are allowed, and Unicode identifiers are prohibited.
        // They also cannot start with __gen or __tact since those prefixes
        // are reserved by the Tact compiler.
        let azAZ09_ = 5; azAZ09_;

        // Instantiations or instance expressions of structs and message structs.
        let addr = BasechainAddress { hash: null, };

        // Field access.
        addr.hash; // null
        self.MOON_RADIUS_KM; // 1738, a contract-level constant
                             // defined below this function

        // Extension function calls (methods).
        self.MOON_RADIUS_KM.toString(); // "1738"
        self.notify("Cashback".asComment()); // rather expensive,
                                             // use cashback() instead
        "hey".asComment(); // allowed on literals

        // Global function calls.
        now(); // UNIX timestamp in seconds
        cashback(sender());

        // Some of the functions can be computed at compile-time given enough data.
        sha256("hey, I'll produce the SHA256 number at compile-time");

        // But there are special, compile-time-only functions.
        let _: Address = address("EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2");
        let _: Cell = cell("te6cckEBAQEAAgAAAEysuc0="); // an empty Cell
        let _: Slice = slice("te6cckEBAQEADgAAGEhlbGxvIHdvcmxkIXgtxbw="); // a Slice with Hello world!
        let _: Slice = rawSlice("000DEADBEEF000"); // CS{Cell{03f...430} bits: 588..644; refs: 1..1}
        let _: Int = ascii("⚡"); // 14850721 or 0xE29AA1, 3 bytes in total
        let _: Int = crc32("000DEADBEEF000"); // 1821923098
        let _: Int = ton("1"); // 10^9 nanoToncoin = one Toncoin,
                               // the main currency of TON Blockchain

        // initOf, which obtains the initial code and initial data
        // of the given contract, i.e., it's initial state.
        initOf MyContract(); // StateInit { code, data }

        // codeOf, which only obtains the code.
        codeOf MyContract;
    }

    // Constants support compile-time expressions
    const MOON_RADIUS_KM: Int = 1730 + (8 | 8);
}`,
  koan: undefined,
};
