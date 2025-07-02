import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "operators",
  title: "Operators",
  content: <>
    <p>
      Almost every contract operates on data: transforming some values into others.
      The scope may vary, but operators lie at the core of such modifications.
    </p>
    <p>
      Most operators have augmented assignment versions, like <code>+=</code>, <code>-=</code>, etc.,
      which form a statement, never an expression.
    </p>
    <p>
      There are no implicit type conversions in Tact, so operators can’t be used to, say,
      add values of different types or compare them in terms of equality without explicitly
      casting them to the same type. That is done with certain functions from the standard library.
      The <code>Int.toString()</code> is an example of such a function.
    </p>
    <p>
      For the precedence order, see the <a
        href="https://docs.tact-lang.org/book/operators/#table">table of operators in Tact documentation</a>.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Operators() {
    get fun showcase() {
        // Let's omit the type ascriptions and let the compiler infer the types.
        let five = 5; // = is an assignment operator,
        //               but it can be a part of the assignment statement only,
        //               because there is no assignment expression
        let four = 4;

        // Common arithmetic operators have predictable precedences.
        five + four - five * four / five % four; // 9

        // You can change order of operations with parentheses.
        (five + (four - five)) * four / (five % four); // 16

        // The % is the modulo, not the remainder operator.
        1 % five; //   1
        1 % -five; // -4

        // Negation and bitwise NOT.
        -five; //    -5: negation of 5
        ~five; //    -6: bitwise NOT of 5
        -(~five); //  6: bitwise NOT, then negation
        ~(-five); //  4: negation, then bitwise NOT

        // Bitwise shifts.
        five << 2; // 20
        four >> 2; // 1
        -four >> 2; // -1, because negation is applied first
        //             and >> performs arithmetic or sign-propagating right shift

        // Other common bitwise operators.
        five & four; // 4, due to bitwise AND
        five | four; // 5, due to bitwise OR
        five ^ four; // 1, due to bitwise XOR

        // Relations.
        five == four; //     false
        five != four; //     true
        five > four; //      true
        five < four; //      false
        five - 1 >= four; // true
        five - 1 <= four; // true

        // Logical checks.
        !(five == 5); //       false, because of the inverse ! operator
        false && five == 5; // false, because && is short-circuited
        true || five != 5; //  true, because || is also short-circuited

        // The non-null assertion operator raises a compilation error if the value
        // is null or if the type of the value is not optional,
        // i.e., it can never be null.
        let maybeFive: Int? = five;
        maybeFive!!; // 5

        // Ternary operator ?: is right-associative.
        false ? 1 : (false ? 2 : 3); // 3
        false ? 1 : true ? 2 : 3; //    2
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
