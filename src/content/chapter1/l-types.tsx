import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "types",
  title: "Types",
  content: <>
    <p>
      Every variable, item, and value in Tact contracts has a type. They can be:
    </p>
    <ul>
      <li>
        One of the primitive types: <code>Int</code>, <code>Bool</code>, <code>Address</code>, <code>Cell</code>, <code>Builder</code>, <code>Slice</code>, <code>String</code>, <code>StringBuilder</code>.
      </li>
      <li>Or one of the composite types: optionals, maps, and structures.</li>
    </ul>
    {/* <p>
      Additionally, many of these types can be made nullable, i.e., contain the special <code>null</code> value.
    </p> */}
    <p>
      When it comes to primitive types in Tact, there are two main groups: integers and cells. All other primitive types are derivatives of those two.
    </p>
    <p>
      Meanwhile, composite types are ways to combine multiple primitive types together or use them to represent some complex data structures, like maps.
    </p>
    <p>
      Serialization and deserialization play a big role on TON. As such, many primitive types can have special representations specified with the <code>as</code> modifier right next to their type identifiers:
    </p>
    <CodeBlock code={tact`let variableName: Int as coins = 42;`} />
  </>,
  quiz: undefined,
  code: tact`contract Types() {
    get fun showcase() {
        // ...TODO
    }
}`,
  koan: undefined,
};
