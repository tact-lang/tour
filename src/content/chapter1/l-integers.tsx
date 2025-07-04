import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "integers",
  title: "Integers",
  content: <>
    <p>
      <code>Int</code> is a 257-bit signed integer, which can have smaller bit-length in persistent contract's state (storage).
    </p>
    <p>
      Boolean or <code>Bool</code> values, true and false, are represented as integers on the blockchain
      with either a single 1 bit or a single 0 bit correspondingly. That said, Tact
      views booleans as a separate type <code>Bool</code>.
      They take only 1 bit when saved in persistent storage, but in runtime operations
      they are no different than the regular 257-bit signed integers.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Integers() {
    get fun showcase() {
        let one_plus_one: Int = 1 + 1; // 2
        let two_by_two: Int = 2 / 2;   // 1
        let three_by_two: Int = 3 / 2; // 1, because the division operator rounds
        //                                toward -∞, which is identical to // operator
        //                                from Python

        let one_billion = 1_000_000_000; // decimal
        let binary_mask = 0b1_1111_1111; // binary
        let permissions = 0o7_5_5; //       octal
        let heHex = 0xFF80_0000_0000; //    hexadecimal

        let nanoToncoin: Int = 1; //    1 nanoToncoin = 0.000,000,001 Toncoin
        let toncoin: Int = ton("1"); // 1 Toncoin = 1,000,000,000 nanoToncoin

        let factual: Bool = !!(true || false);
        let fax: Bool = true && factual;
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
