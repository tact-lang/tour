import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "contracts",
  title: "Contract structure",
  content: <>
    <p>
      TODO: contract structure
    </p>
  </>,
  quiz: undefined,
  code: tact`import "@stdlib/ownable"; // for the Ownable trait

// Contract definitions in Tact conveniently represent smart contracts
// on TON Blockchain. They hold all variables, functions, getters and receivers,
// while providing accessible abstractions for working with them.
contract MyContract(
    // Persistent state variables of the contract:
    owner: Address, // required field from the Ownable trait
    accumulator: Int as uint8,
    // Their default or initial values are supplied during deployment.
) with Ownable {

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

    // The bounced message receiver is a function that handles messages sent
    // from this contract and bounced back to it because of a malformed payload or
    // some issues on the recipient side.
    bounced(msg: bounced<MyMsg>) {
        // Bounced message bodies are limited by their first 256 bits, which
        // means that excluding their 32-bit opcode there are only 224 bits left
        // for other contents of MyMsg.
        //
        // Thus, in message structs prefer to put small important fields first.
        require(msg.someVal > 42, "Unexpected bounce!");
        self.accumulator = msg.someVal;
    }

    // The external message receiver is a function that handles messages sent
    // to this contract from outside the blockchain. That is often the case
    // for user wallets, where apps that present some UI for them have to
    // communicate with contracts on chain to perform transfers on their behalf.
    external(msg: MyMsg) {
        // There is no sender, so calling sender() here won't work.
        // Additionally, there are no guarantees that the received message
        // is authentic and is not malicious. Therefore, when receiving
        // such messages one has to first check the signature to validate the sender,
        // and explicitly agree to accept the message and fund its processing
        // in the current transaction with acceptMessage() function.
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

    // Finally, for each inherited trait contract may override its virtual internal
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
