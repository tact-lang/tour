import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "integers",
  title: "Integers",
  content: <>There are two main groups of primitive types in Tact: integers and cells. All other primitive types are derivatives of those two.</>,
  quiz: undefined,
  code: tact`// Integers are always 257-bit signed in runtime operations,
// but may have different lengths in persistent contract's state (storage).

contract Integers() {
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

        // Booleans (true and false) count as a separate type in Tact,
        // but on the blockchain they are represented as integers.
        //
        // They take only 1 bit when saved in persistent storage.

        let factual: Bool = !!(true || false);
        let fax: Bool = true && factual;
    }
}`,
  koan: undefined,
};
