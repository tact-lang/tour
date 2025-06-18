import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "counter",
  quiz: undefined,
  koan: undefined,
  title: "Simple counter",
  content: <>👀👉</>,
  code: tact`// Comments and annotated blocks should be on the left...

// Defining a new Message type, which has one field
// and an automatically assigned 32-bit opcode prefix
message Add {
    // unsigned integer value stored in 4 bytes
    amount: Int as uint32;
}

// Defining a contract
contract SimpleCounter(
    // Persistent state variables of the contract:
    counter: Int as uint32, // actual value of the counter
    id: Int as uint32, // a unique id to deploy multiple instances
                       // of this contract in a same workchain
    // Their default or initial values are supplied during deployment.
) {
    // Registers a receiver of empty messages from other contracts.
    // It handles internal messages with null body
    // and is very handy and cheap for the deployments.
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    // Registers a binary receiver of the Add message bodies.
    receive(msg: Add) {
        self.counter += msg.amount; // <- increase the counter
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    // A getter function, which can only be called from off-chain
    // and never by other contracts. This one is useful to see the counter state.
    get fun counter(): Int {
        return self.counter; // <- return the counter value
    }

    // Another getter function, but for the id:
    get fun id(): Int {
        return self.id; // <- return the id value
    }
}`
};
