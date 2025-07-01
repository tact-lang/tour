import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "maps",
  title: "Maps",
  content: <>
    <p>
      The composite type <code>{"map<K, V>"}</code> is used to associate keys of type <code>K</code> with corresponding values of type <code>V</code>.
    </p>
    <p>
      Serialization of integer keys or values is possible but only meaningful
      for maps as fields of structures and maps in the contract's persistent state.
      See the "Structs and message structs" and "Persistent state"
      lessons later for more info.
    </p>
    <p>
      Finally, mind the limits — maps are quite gas-expensive
      and have an upper limit of around 32k entries for the whole contract.
      That is because on TON, contracts are very limited in their state, and for large
      or unbounded, infinitely large maps, it is better to use contract sharding
      and essentially make the entire blockchain part of your maps.
    </p>
    {/* <p>
      We'll discuss sharding after we are done with the syntax basics
      See the sharded approach in action for the Jetton (token)
      contract system by the end of this tour.
    </p> */}
  </>,
  quiz: undefined,
  code: tact`contract Maps() {
    get fun showcase() {
        // A map of Int keys to Int values.
        // Type ascription is mandatory.
        let myMap: map<Int, Int> = emptyMap();

        // Maps have a number of built-in methods.
        myMap.set(0, 10);          // key 0 now points to value 10
        myMap.set(0, 42);          // overriding the value under key 0 with 42
        myMap.get(0)!!;            // 42, because get can return null if the key doesn't exist
        myMap.replace(1, 55);      // false, because there was no key 1 and map didn't change
        myMap.replaceGet(0, 10)!!; // 42, because the key 0 exists and the old value there was 42
        myMap.get(0)!!;            // 10, since we've just replaced the value with .replaceGet
        myMap.del(0);              // true, because the map contained an entry under key 0
        myMap.del(0);              // false and not an error, because deletion is idempotent
        myMap.exists(0);           // false, there is no entry under key 0
        myMap.isEmpty();           // true, there is no other entries

        // Statically known .set() calls can be replaced by map literals.
        // That way, map entries will be defined at compile-time and consume much less gas.
        let myMap2 = map<Int as uint8, Int as int13> {
            // Key expression: Value expression
            1 + 2: 10 * pow2(3), // key 3, value 80
            1 + 3: 20 * pow2(4), // key 4, value 320
        };

        // In most cases, to compare two maps it's sufficient to use the shallow
        // comparison via the equality == and inequality != operators.
        myMap == emptyMap(); // true

        // To traverse maps, the foreach statement is used.
        // See the "Statements" section below for more info.
        foreach (k, v in myMap) {
            // ...do something for each entry, if any
        }

        // There are many other allowed kinds of map value types for Int keys
        let _: map<Int, Bool> = emptyMap();    // Int keys to Bool values
        let _: map<Int, Cell> = emptyMap();    // Ints to Cells
        let _: map<Int, Address> = emptyMap(); // Ints to Addresses
        let _: map<Int, AnyStruct> = emptyMap();  // Ints to some structs
        let _: map<Int, AnyMessage> = emptyMap(); // Ints to some message structs

        // And all the same value types for maps with Address keys are also allowed.
        let _: map<Address, Int> = emptyMap();     // Address keys to Int values
        let _: map<Address, Bool> = emptyMap();    // Addresses to Bools
        let _: map<Address, Cell> = emptyMap();    // Addresses to Cells
        let _: map<Address, Address> = emptyMap(); // Addresses to Addresses
        let _: map<Address, AnyStruct> = emptyMap();  // Addresses to some structs
        let _: map<Address, AnyMessage> = emptyMap(); // Addresses to some message structs

        // Under the hood, empty maps are nulls, which is why it's important to provide a type ascription.
        let _: map<Int, Int> = null; // like emptyMap(), but less descriptive and generally discouraged

        // Furthermore, as with many other types, maps are just Cells with a distinct data layout.
        // Therefore, you can type cast any map back to its underlying Cell type.
        myMap.asCell();
    }
}

// The following are dummy structures needed for the showcase above to work.
struct AnyStruct { field: Int }
message AnyMessage { field: Int }`,
  koan: undefined,
};
