import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "import",
  title: "Importing code",
  content: <>
    <p>
      Tact allows you to import Tact and FunC code.
      Additionally, there's a versatile set of standard libraries
      which come bundled in with a compiler, but are not included
      in projects right away.
    </p>
    <p>
      All imported code is combined together with yours, so it’s important to avoid name collisions and always double-check the sources!
    </p>
    <p>
      Moreover, imports are transitive and are always automatically exported — if an <code>a.tact</code> imports <code>b.tact</code>, which in turn imports <code>c.tact</code>, then all the definitions from <code>c.tact</code> are immediately accessible in <code>a.tact</code> without an explicit import of <code>c.tact</code> to it.
    </p>
    <CodeBlock
      code={tact`// c.tact
trait StatelessGetters {
    get fun bar(): Int { return 42 }
    get fun baz(): Int { return 43 }
}`}
    />
    <CodeBlock
      code={tact`// b.tact
import "c.tact";`}
    />
    <CodeBlock
      code={tact`// a.tact
import "b.tact";

// Definitions available in "c.tact" are now available in this file
// due to their transitive import from the "b.tact" file.
contract Transitive() with StatelessGetters {}`}
    />
  </>,
  quiz: undefined,
  code: tact`// To import a local Tact file, specify a path to it.
import "./some-other-file.tact";
import "./tact-extension-is-assumed";

// To import a standard library, instead of specifying a path to a file,
// start the import string with @stdlib/
import "@stdlib/ownable";

// You can also import FunC code.
import "./relative/../path/to/func/file.fc";

// To bind to or wrap the respective functions from FunC to Tact,
// the so-called native functions are used.
@name(some_func_function_name)
native tactBoundName(tactParam1: Int, tactParam2: Slice): Cell;`,
  koan: undefined,
};
