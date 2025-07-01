import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "functions",
  title: "Functions",
  content: <>
    <p>
      Tact offers a diverse set of function kinds and attributes that provide great flexibility and expressivity.
      While some functions stand out, many of their parts and behaviors are common.
    </p>
    <p>
      Due to the nature of TVM, Tact uses the <a href="https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_value">call by value</a>
      parameter-passing and binding strategy, which applies to all function kinds.
      That is, the evaluated value of any variable passed in a function call or assigned
      in the <code>let</code> or assignment statement is copied.
    </p>
    <p>
      Therefore, there are no modifications of the original values in different scopes,
      except for the extension mutation functions. And even so, those functions do not mutate
      the original value denoted by the <code>self</code> keyword — instead,
      they discard the old value and replace it with the new one obtained at the end of the function body.
    </p>
    <p>
      The functions discussed in this lesson are helpful but not mandatory for the contracts to operate,
      unlike the receiver functions, which can only be defined at the contract or trait levels and cannot be called directly —
      they are only executed upon receiving specific messages. See the "Contracts and traits" lesson later for more info.
    </p>
  </>,
  quiz: undefined,
  code: tact`// Global function with parameters and return type.
fun add(a: Int, b: Int): Int {
    return a + b;
}

// Global function have a set of optional attributes that can change their demeanor.
// For example, inline attribute will make the body of this
// function inlined in all places where this function is called,
// increasing the total code size and possibly reducing computational fees.
inline fun reply(str: String) {
    message(MessageParameters {
        to: sender(),
        value: 0,
        mode: SendRemainingValue | SendIgnoreErrors,
        body: str.asComment(),
    });
}

// The extends attribute allows to implement extension functions for any type.
// Its first parameter in the signature must be named self,
// and its type is the type this function is extending.
// Think of extension functions as very flexible method definitions
// in popular programming languages.
extends fun toCoinsString2(self: Int): String {
    return self.toFloatString(9);
}

// On top of the extends attribute, you may add the mutates attribute,
// which would allow mutating the value of the currently extended type.
extends mutates fun hippityHoppity(self: Int) {
    // ...something that would mutate \`self\`
    self += 1;
}

// Tact allows you to import Tact and FunC files.
// To bind to or wrap the respective functions in FunC,
// the so-called native functions are used.
//
// Prior to defining them, make sure to add the
// required \`import "./path/to/file.fc";\` on top of the file.
@name(get_data) // here, import is not needed,
//                 because the stdlib.fc is always implicitly imported
native getData(): Cell;

// Finally, there are advanced module-level functions that allow you
// to write Tact assembly. Unlike all other functions, their bodies consist
// only of TVM instructions and some other primitives as arguments to instructions.
asm fun rawReserveExtra(amount: Int, extraAmount: Cell, mode: Int) { RAWRESERVEX }

// Examples of calling the functions defined above
contract Functions() {
    fun showcase() {
        // Global function
        add(1, 2); // 3

        // Inlined global function
        reply("Viltrum Empire");

        // Extension function
        5.toCoinsString2(); // 0.000000005

        // Extension mutation function
        let val = 10;
        val.hippityHoppity();
        val; // 11

        // Native function, called just like global functions
        getData(); // Cell with the contract's persistent storage data.

        // Assembly function, called just like global functions
        rawReserveExtra(ton("0.1"), emptyCell(), 0);
    }
}`,
  koan: undefined,
};
