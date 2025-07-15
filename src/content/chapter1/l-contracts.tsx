import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "contracts",
  title: "Contract structure",
  content: <>
    <p>
      Contracts are similar to classes in popular object-oriented languages, except that their instances are deployed on the blockchain and can’t be passed around like structs and message structs.
    </p>
    <p>
      Contract definitions in Tact conveniently represent smart contracts
      on TON Blockchain. They hold all variables, functions, getters and receivers,
      while providing accessible abstractions for working with them.
    </p>
    <p>
      Each contract can be defined with or contain:
    </p>
    <ul>
      <li>Inherited traits via the <code>with</code> keyword</li>
      <li>Supported interfaces via the <code>@interface()</code> annotation</li>
      <li>Contract parameters, a convenient syntax for declaring persistent state variables</li>
      <li>Persistent state variables defined as contract fields (legacy syntax)</li>
      <li>Constructor function <code>init()</code> that works with contract fields, but not with contract parameters</li>
      <li>Contract-level constants: <code>const VALUE: Int = 100</code></li>
      <li>Getter functions: <code>get fun something()</code></li>
      <li>Receiver functions: <code>receive()</code>, <code>bounced()</code>, <code>external()</code></li>
      <li>And, finally, arbitrary private helper functions</li>
    </ul>
    <p>
      By using the special <code>self</code> keyword, you can access the data variables,
      constants, and internal or getter functions that are defined in the contract or
      inherited by it from some of the traits.
    </p>
    <p>
      Additionally, Tact allows converting runtime contract instances to cells or slices by
      calling <code>self.toCell()</code> or <code>self.toSlice()</code> respectively.
      Those cells and slices contain contract data: all contract fields plus the leading
      bit representing the lazy initialization bit if the contract doesn't use the contract
      parameters syntax.
    </p>
    <CodeBlock code={tact`contract PseudoWalletContract(
    seqno: Int as uint32,
    walletId: Int as int32,
    publicKey: Int as uint256,
    extensions: map<Address, Bool>,
) {
    get fun stateAsCell(): Cell {
        return self.toCell(); // ← current field values packed as a Cell
    }
    get fun state(): PseudoWalletContract {
        return self;
    }
}`} />
  </>,
  quiz: undefined,
  code: tact`import "@stdlib/ownable"; // for the Ownable trait

contract MyContract(
    // Persistent state variables of the contract:
    owner: Address, // required field from the Ownable trait
    accumulator: Int as uint8,
    // Their default or initial values are supplied during deployment.
) with Ownable {
    // A contract constant
    const MOON_RADIUS_KM: Int = 1730 + (8 | 8);
    
    // An internal message receiver.
    receive(msg: MyMsg) {
        self.requireOwner();
        self.accumulator += msg.someVal;

        // Sends a message back to the sender() with MyMsg
        message(MessageParameters {
            to: sender(),
            value: ton("0.04"),
            body: MyMsg{ someVal: self.accumulator }.toCell(),
        });
    }

    // An "empty receiver" that handles empty internal message bodies,
    // which are commonly used for deployments.
    receive() { }

    // A bounced message receiver.
    bounced(msg: bounced<MyMsg>) {
        require(msg.someVal > 42, "Unexpected bounce!");
        self.accumulator = msg.someVal;
    }

    // An external message receiver.
    external(msg: MyMsg) {
        require(msg.someVal > 42, "Nothing short of 42 is allowed!");
        self.accumulator = msg.someVal;
        acceptMessage();
    }

    // Getter functions or get methods are special functions that can only
    // be called from within this contract or off-chain, and never by other contracts.
    // They cannot modify the contract's state and they do not affect its balance.
    // The IO analogy would be that they can only "read", not "write".
    get fun data(): MyContract {
        // This getter returns the current state of the contract's variables,
        // which is convenient for tests but not advised for production.
        return self;
    }
}

// Message struct with 123 as its 32-bit opcode.
message(123) MyMsg {
    someVal: Int as uint8;
}`,
  koan: undefined,
};
