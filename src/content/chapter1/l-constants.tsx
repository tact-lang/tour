import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "constants",
  title: "Constants",
  content: <>
    <p>
      TODO
    </p>
  </>,
  quiz: undefined,
  code: tact`// Global, top-level constants.
// Type ascription is mandatory.
const MY_CONSTANT: Int =
    ascii("⚡"); // expressions are computed at compile-time

// Trait-level constants.
trait MyTrait {
    const I_AM_ON_THE_TRAIT_LEVEL: Int = 420;

    // On the trait-level, you can make constants abstract,
    // which requires the contracts that inherit this trait
    // to override those constants with some values.
    abstract const OVERRIDE_ME: Int;

    // Virtual constants allow overrides, but do not require them.
    virtual const YOU_CAN_OVERRIDE_ME: Int = crc32("babecafe");
}

// Contract-level constants.
contract MyContract() with MyTrait {
    const iAmOnTheContractLevel: Int = 4200;

    // Because this contract inherits from MyTrait,
    // the I_AM_ON_THE_TRAIT_LEVEL constant is also in scope of this contract,
    // but we cannot override it.

    // However, we can override the virtual constant.
    override const YOU_CAN_OVERRIDE_ME: Int = crc32("deadbeef");

    // And we MUST override and define the value of the abstract constant.
    override const OVERRIDE_ME: Int = ton("0.5");
}

// All constants are inlined, i.e., their values are embedded in the resulting
// code in all places where their values are referenced in Tact code.
//
// The main difference is the scope — global can be referenced
// from anywhere, while contract and trait-level constants are
// only accessible within them via \`self\` references.`,
  koan: undefined,
};
