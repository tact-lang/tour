import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "traits",
  title: "Trait inheritance",
  content: <>
    <p>
      Tact doesn't support classical class inheritance but instead introduces the concept of _traits_, which can be viewed as abstract contracts, like abstract classes in popular object-oriented languages. They have the same structure as contracts but cannot initialize persistent state variables. That is, the only thing traits lack is the special <code>init()</code> function.
    </p>
    <p>
      Traits allow the contracts inheriting them to re-use all or some of the functions and override the behavior of others. Traits also allow inheriting and overriding constants.
    </p>
    <p>
      To inherit a trait and all of its transitive contents, specify the name of the trait after the <code>with</code> keyword in the contract definition.
    </p>
  </>,
  quiz: undefined,
  code: tact`import "@stdlib/ownable"; // for the Ownable trait

// Like contracts, traits can also inherit other traits.
trait MyTrait with Ownable {
    owner: Address; // required field from the Ownable trait

    // Within traits and contracts, you can define scoped functions
    // and only accessible from them or their successors. Those functions
    // are often called internal functions.
    //
    // If you won't be using any contract fields, it's better to define
    // such functions as global, i.e., on the top-level.
    fun addIfOwner(a: Int, b: Int): Int {
        self.requireOwner();
        return a + b;
    }

    // Adding an abstract attribute to the internal function requires us
    // to omit their body definitions and demand that from contracts that
    // will inherit the trait.
    abstract fun trust(msg: MyMsg);

    // Adding a virtual attribute to the internal function allows their
    // body definitions to be be overridden in the contracts that will
    // inherit the trait.
    virtual fun verify(msg: MyMsg) {
        self.requireOwner();
        require(msg.someVal > 42, "Too low!");
    }
}

contract MyContract(
    owner: Address,
    accumulator: Int as uint8,
) with MyTrait, Ownable {

    // The internal message receiver is a function that handles messages received
    // by this contract on-chain: from other contracts and never from outside.
    receive(msg: MyMsg) {
        self.requireOwner();
        self.accumulator += msg.someVal;

        // Send a message back to the sender() with MyMsg
        message(MessageParameters {
            to: sender(),
            value: ton("0.04"),
            body: MyMsg{ someVal: self.accumulator }.toCell(),
        });
    }

    // For deployments, it is common to use the following receiver
    // often called an "empty receiver", which handles \`null\` (empty)
    // message bodies of internal messages.
    receive() {
        // Forward the remaining value in the
        // incoming message (surplus) back to the sender.
        cashback(sender());
    }

    // For each inherited trait contract may override its virtual internal
    // functions and it MUST override its abstract internal functions as to provide
    // their defined bodies.
    override fun trust(msg: MyMsg) {
        require(msg.someVal == 42, "Always bring your towel with you");
    }
}

// Message struct with 123 as its 32-bit opcode.
message(123) MyMsg {
    someVal: Int as uint8;
}`,
  koan: undefined,
};
