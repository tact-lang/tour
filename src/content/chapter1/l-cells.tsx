import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "cells",
  title: "Cells, Builders, Slices",
  content: <>
    <p>
      <code>Cell</code> is a type and an immutable data structure that can contain up to 1023 bits of data with up to 4 references to other cells. Cyclic references are prohibited.
    </p>
    <p>
      Cells are a fundamental primitive and data structure on TON Blockchain: contracts communicate and interact by sending and receiving cells while their code and data are themselves stored as cells on the blockchain the code and the data of each contract are cells and contracts communicate and interact by sending and receiving cells.
    </p>
    <p>
      Furthermore, all data layouts are also expressed in terms of cells and cell (de)serialization primitives: <code>Builder</code> and <code>Slice</code>. Builder is an immutable primitive to construct (compose) cells, while slice is a mutable primitive to deconstruct (parse) cells.
    </p>
    <p>
      In fact, <code>Address</code> and <code>String</code> types both are a <code>Slice</code> under the hood, although with a well-defined distinct data layout for each. And while implicit type conversions aren't allowed in Tact, there are extension functions that can be used for those purposes, such as <code>String.asSlice</code> or <code>Address.asSlice()</code>. Advanced users can introduce their own casts by using assembly functions. See the "Functions" lesson later for more info.
    </p>
    {/* <p>
      However, manual composition and parsing of cells is tedious, error-prone and is generally not recommended. Tact provides declarative means to express (de)serialization to and from cells conveniently by using structures — see the "Structs and message structs" lesson later on.
    </p> */}
  </>,
  quiz: undefined,
  code: tact`contract Cells() {
    get fun showcase() {
        // ...aaaand it's gone.
        let emptyC: Cell = emptyCell();

        // Builder is an immutable primitive to construct (compose) cells.
        let bb: Builder = beginCell()
            .storeUint(42, 6) //  storing 42 using 6 bits
            .storeInt(42, 7) //   storing 42 using 7 bits (signed Int)
            .storeBool(true) //   writing 1 as a single bit
            .storeBit(true) //    alias to storeBool()
            .storeCoins(40) //    common way of storing nanoToncoins
            .storeAddress(myAddress())
            .storeRef(emptyC); // storing a reference
        let composed: Cell = bb.endCell();

        // Slice is a mutable primitive to deconstruct (parse) cells.
        let target: Slice = composed.asSlice();

        // The type ascription is optional for most cases except for maps
        // and optional types, but we'll discuss those in later lessons.
        //
        // Here we take 6 bits out of the target Slice,
        // mutating it in the process, and saving the taken bits as an Int.
        let fortyTwo = target.loadUint(6);

        // If you don't want the result, you can ignore it with a wildcard.
        let _ = target.loadInt(7);

        // Finally, there are methods to skip the value, i.e., to discard it.
        target.skipBool();
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
