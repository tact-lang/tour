import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "state",
  title: "Persistent state",
  content: <>
    <p>
      Contracts can define state variables that persist between contract calls,
      and thus commonly referred to as storage variables. On TON, contracts pay rent (storage fees)
      in proportion to the amount of persistent space they consume, so compact
      state representations via serialization are encouraged.
    </p>
    <p>
      Serialization to smaller values only applies for the state between
      transactions and incoming or outgoing message bodies.
      This is because at runtime everything is computed
      at their maximum capacity and all integers are assumed to
      be 257-bit signed ones.
    </p>
    <p>Unlike variables, constants do not consume space in the persistent state.</p>
  </>,
  quiz: undefined,
  code: tact`contract StateActor(
    // Persistent state variables
    oneByte: Int as uint8,  // ranges from -128 to 127
    twoBytes: Int as int16, // ranges from -32,768 to 32,767
    currency: Int as coins, // variable bit-width format, which occupies
    //                         between 4 and 124 bits
    //                         and ranges from 0 to 2^120 - 1
) {
    receive() {
        // The following would not cause any runtime overflows,
        // but will throw an out of range error only after the execution of
        // this receiver is completed.
        self.oneByte = -1;  // this won't fail immediately
        self.oneByte = 500; // and this won't fail right away either

    } // only here, at the end of the compute phase,
      // would an error be thrown with exit code 5:
      // Integer out of expected range
}`,
  koan: undefined,
};
