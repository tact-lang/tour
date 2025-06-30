import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "statements",
  title: "Statements and control flow",
  content: <>
    <p>
      TODO
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Statements() {
    get fun showcase() {
        // As we've seen above, the let statement defines new variables.
        // You must always provide an initial value, but type ascriptions
        // aren't mandatory except for maps and null values.
        let theAnswer = 42;                // type ascription is not required here,
        let m: map<Int, Int> = emptyMap(); // but we must specify it for maps
        let opt: Int? = null;              // and when assigning a null value.

        // Block statement creates an enclosed scope.
        {
            // theAnswer is accessible here
            let privateVal = theAnswer + 27;
            // but privateVal is no longer visible after this block ends.
        }

        // Assignment statement allows reassigning variables.
        theAnswer = -(~theAnswer + 1);

        // Almost every binary operator can form an augmented assignment,
        // except for relational and equality ones,
        // and excluding the assignment operator itself.
        theAnswer += 5; // equivalent to: theAnswer = theAnswer + 5;
        theAnswer -= 5; // equivalent to: theAnswer = theAnswer - 5;
        theAnswer *= 5; // and so on, see the Operators page for more.

        // Destructuring assignment is a concise way to
        // unpack structures into distinct variables.
        let st = StdAddress { workchain: 0, address: 0 }; // let statement
        let StdAddress { address, .. } = st;              // destructuring statement
        //               -------  --
        //               ↑        ↑
        //               |        ignores all unspecified fields
        //               Int as uint256,
        //               a variable out of the second field of StdAddress struct
        address; // 0

        // You can also define new names for variables
        // derived from the struct fields.
        let StdAddress { address: someNewName, .. } = st;
        someNewName; // 0

        // Conditional branching with if...else.
        if (false) { // curly brackets (code blocks) are required!
            // ...then branch
        } else if (false) {
            // ...else branch
        } else {
            // ...last else
        }

        // Try and try...catch, with partial rollback.
        try {
            throw(777);
        } catch (exitCode) { // 777
            // An exit code is an integer that indicates whether the transaction
            // was successful, and if not — holds the code of the exception that occurred.
            //
            // The catch block that can catch run-time (compute phase) exit codes
            // will roll back almost all changes made in the try block,
            // except for: codepage changes, gas usage counters, etc.
            //
            // See the "Testing and debugging" section below for more info.
        }

        // Repeat something N times.
        repeat (2003) {
            dump("mine"); // greet the Nemo
        }

        // Loop with a pre-condition: while.
        while (theAnswer > 42) {
            theAnswer /= 5;
        }

        // Loop with a post-condition: do...until.
        do {
            // This block will be executed at least once,
            // because the condition in the until close
            // is checked after each iteration.
            m = emptyMap();
        } until (false);

        // Traverse over all map entries with foreach.
        m.set(100, 456);
        m.set(23, 500);
        foreach (key, value in m) { // or just k, v: naming is up to you
            // Goes from smaller to bigger keys:
            // first iteration key = 23
            // second iteration key = 100
        }

        // If you don't want key, value, or both, then use a wildcard.
        let len = 0;
        foreach (_, _ in m) {
            len += 1; // don't mind me, just counting the size of the map
        }

        // Finally, return statement works as usual.
        return; // implicitly produces nothing (named "void" in the compiler)
        // return 5; // would explicitly produce 5
    }
}`,
  koan: undefined,
};
