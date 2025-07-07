import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "structures",
  title: "Structs and message structs",
  content: <>
    <p>
      Structs and message structs allow multiple values to be packed together
      in a single type. They are very useful for (de)serialization of cells
      and for usage as parameters or return types in functions.
    </p>
    <CodeBlock
      code={tact`struct Pair { x: Int; y: Int }`}
    />
    <p>
      Message structs are almost the same as regular structs,
      but they have a 32-bit integer header in their serialization.
      This unique numeric ID is commonly referred to as an opcode (operation code),
      and it allows message structs to be used with special receiver functions
      that distinguish incoming messages based on this ID.
    </p>
    <p>
      By default, Tact generates and implicitly sets the 32-bit <code>Int</code> opcode.
      However, you can manually override it with any compile-time expression that
      evaluates to a non-negative 32-bit integer.
    </p>
    <CodeBlock
      code={tact`message((crc32("Tact") + 42) & 0xFFFF_FFFF) MsgWithExprOpcode {}`}
    />
  </>,
  quiz: undefined,
  code: tact`// Struct containing a single value
struct One { number: Int; }

// Struct with default fields, fields of optional types, and nested structs
struct Params {
    name: String = "Satoshi"; // default value

    age: Int?; // field with an optional type Int?
    //            and an implicit default value of null

    val: One; // nested struct One
}

// You can instruct how to (de)compose the Cells to and from structs
// by specifying certain serialization options after the \`as\` keyword.
struct SeriesXX {
    i64: Int as int64; //  signed 64-bit integer
    u32: Int as uint32; // unsigned 32-bit integer
    ufo51: Int as uint51; // uneven formats are allowed too,
    //                       so this is an unsigned 51-bit integer

    // In general, uint1 through uint256 and int1 through int257
    // are valid serialization formats for integer values.
    maxi: Int as int257; // Int is serialized as int257 by default,
    //                      but now it is explicitly specified

    // If this struct will be obtained from some Slice,
    // you can instruct the compiler to place the remainder of that Slice
    // as the last field of the struct, and even type cast the value
    // of that field to Cell, Builder or Slice at runtime.
    lastFieldName: Cell as remaining; // there can only be a single \`remaining\` field,
    //                                   and it must be the last one in the struct
}

// The order of fields matters, as it corresponds to the resulting
// memory layout when the struct will be used to compose a Cell
// or to parse a Slice back to the struct.
struct Order {
    first: Int; // 257 continuously laid out bits
    second: Cell; // up to 1023 bits,
    //               which will be placed in a separate ref
    //               when composing a Cell
    third: Address; // 267 bits
}

// Message struct with no fields.
// It is not not empty because of the automatically
// generated and implicitly set 32-bit Int opcode.
message ImplicitlyAssignedId {}

// This message has an opcode of 898001897, which is the evaluated
// integer value of the specified compile-time expression.
message((crc32("Tact") + 42) & 0xFFFF_FFFF) MsgWithExprOpcode {
    // All the contents are defined identical to regular structs.
    field1: Int as uint4; // serialization
    field2: Bool?; // optionals
    field3: One; // nested structs
    field4: ImplicitlyAssignedId; // nested message structs
}

contract Structures() {
    get fun showcase() {
        // Instantiation of a struct.
        // Notice the lack of the "new" keyword used for this in many
        // other traditional languages.
        let val: One = One { number: 50 };

        // You can omit the fields with default values.
        let _ = Params { val }; // the field punning works —
        //                         instead of \`val: val\` you could write just \`val\`

        // Convert a struct to a Cell or a Slice.
        let valCell = val.toCell();
        let valSlice = val.toSlice();

        // Obtain a struct from a Cell or a Slice.
        let _ = One.fromCell(valCell);
        let _ = One.fromSlice(valSlice);

        // Conversion works both ways.
        One.fromCell(val.toCell()).toCell() == valCell;
        One.fromSlice(val.toSlice()).toSlice() == valSlice;
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
