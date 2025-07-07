import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "expressions",
  title: "Expressions",
  content: <>
    <p>
      Every operator in Tact forms an expression, but there’s much more to uncover,
      as Tact offers a wide range of expressive options to choose from.
    </p>
    <p>
      Notice that identifiers form an expression and have the usual naming conventions:
      they may contain Latin lowercase letters <code>a-z</code>,
      Latin uppercase letters <code>A-Z</code>, underscores <code>_</code>,
      and digits <code>0-9</code>, but may not start with a digit.
      No other symbols are allowed, and Unicode identifiers are prohibited.
      They also cannot start with <code>__gen</code> or <code>__tact</code>
      since those prefixes are reserved by the Tact compiler.
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

        // Single-line string literals.
        "You can be The Good Guy or the guy who saves the world... You can't be both.";
        "1234"; // a string, not a number
        "👻"; // strings support Unicode
        // Common ASCII and Unicode escape sequences are supported too.

        // Special literals.
        null; // not an instance of a primitive type, but
        //       a special value that represents the intentional absence
        //       of any other value

        self; // used to reference the current contract from within
              // and the value of the currently extended type inside
              // the extension function. See the "Functions" section below for more.

        // Map literals.
        map<Int, Int as coins> { 11: 11 };

        // Identifiers.
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
        // All compile-time values are embedded directly into the resulting code..
        sha256("hey, I'll produce the SHA256 hash during compilation");

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
        initOf Expressions(); // StateInit { code, data }

        // codeOf, which only obtains the code.
        codeOf Expressions;
    }

    // Constants support compile-time expressions
    const MOON_RADIUS_KM: Int = 1730 + (8 | 8);

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
