import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "cells",
  title: "Cells, Builders, Slices",
  content: <>
    <p>
      Cell is an immutable data structure that can contain up to 1023 bits of data with up to 4 references to other cells. Cyclic references are prohibited.
    </p>
    <p>
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Cells() {
    get fun showcase() {
        let emptyC: Cell = emptyCell();

        // Cells are a fundamental primitive and data structure on TON Blockchain:
        // contracts communicate and interact by sending and receiving cells while
        // their code and data are themselves stored as cells on the blockchain
        // the code and the data of each contract are cells and contracts
        // communicate and interact by sending and receiving cells.
        //
        // Furthermore, all data layouts are also expressed in terms of cells and
        // cell (de)serialization primitives. That said, Tact provides declarative means
        // to express (de)serialization to and from cells conveniently —
        // see the "Structs and message structs" subsection below for more info.

        // Builder is an immutable primitive to construct (compose) cells.
        let bb: Builder = beginCell()
            .storeUint(42, 6)  // storing 42 using 6 bits
            .storeInt(42, 7)   // storing 42 using 7 bits (signed Int)
            .storeBool(true)   // writing 1 as a single bit
            .storeBit(true)    // alias to storeBool()
            .storeCoins(40)    // common way of storing nanoToncoins
            .storeAddress(myAddress())
            .storeRef(emptyC); // storing a reference
        let composed: Cell = bb.endCell();

        // Slice is a mutable primitive to deconstruct (parse) cells.
        let target: Slice = composed.asSlice(); // let's start parsing the composed Cell

        // The type ascription is optional for most cases except for maps
        // and optional types, but we'll discuss those in the
        // "Composite types" section below.
        let fortyTwo = target.loadUint(6); // taking 6 bits out of the target Slice,
                                           // mutating it in the process

        // If you don't want the result, you can ignore it with a wildcard.
        let _ = target.loadInt(7);

        // Finally, there are methods to skip the value, i.e., to discard it.
        target.skipBool();

        // Manual composition and parsing of Cells is tedious,
        // error-prone and is generally not recommended.
        // Instead, prefer using structures: struct and message struct types.
        // See the "Composite types" section below for more info.
        //
        // Finally, under the hood, Address and String types are a Slice,
        // although with a well-defined distinct data layout for each.
        //
        // While implicit type conversions aren't allowed in Tact,
        // there are extension functions that can be used for those purposes,
        // such as String.asSlice() or Address.asSlice().
        //
        // Advanced users can introduce their own casts by using assembly functions.
        // See the "Functions" section below for more info.
    }
}`,
  koan: undefined,
};

// TODO.
