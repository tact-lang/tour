import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "messaging",
  title: "Message exchange and communication",
  content: <>
    <p>
      On TON, contracts cannot read each other's states and cannot synchronously
      call each other's functions. Instead, the actor model of communication is
      applied — contracts send or receive asynchronous messages that influence each other's state.
    </p>
    <p>
      Each message body is a Cell with a well-defined, complex structure of serialization.
      However, Tact provides you with simple abstractions to send and receive messages,
      as well as to (de)serialize message bodies to and from various structures.
    </p>
    <p>
      Message body is the primary content of the message. They can contain various
      data fields, but in order to differentiate them and their data layouts, it's
      very common to start message bodies with certain 4-byte opcodes.
    </p>
    <p>
      Non-zero opcodes represent binary messages that are represented by message structs, and zero opcodes represent text messages, which only contain
      some string data and no subsequent fields.
    </p>
    <p>
      Messages can also omit their bodies or have them be empty, in which case
      they won't have any opcode, but could still be handled with special functions
      called receivers. See the next lesson for more info.
    </p>
    <p>
      Finally, sending messages is not free and requires some forward fees to be paid upfront. The value attached with the messages and the fees are paid in Toncoin, the primary currency of TON Blockchain. Fortunately, the network costs are rather low, but it is something to keep in mind nonetheless, especially when designing systems that send multiple messages during a single transaction.
    </p>
    <p>
      Forward fees are also paid by the messages that were sent by your contract but ill-processed on the recipient side,
      such that the transaction was reverted and the message came or "bounced" back. To successfully bounce,
      messages must have enough Toncoin value attached to them at the moment of initial send.
    </p>
  </>,
  quiz: undefined,
  code: tact`// Message struct with 123 as its 32-bit opcode.
message(123) MyMsg {
    someVal: Int as uint8;
}

contract Messaging() {
    fun showcase() {
        // This is most general and simple function to send an internal message:
        message(MessageParameters {
            // Recipient address.
            to: address("UQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p9dz"),

            // Optional message body, which we are constructing from the
            // message struct MyMsg and serializing it as a cell.
            body: MyMsg{ someVal: 42 }.toCell(),

            // Some nanoToncoins to send, possibly none.
            value: 0, // do not attach any nanoToncoins to the message

            // Configure various modes of sending the message in regards to how
            // the funds will be charged, how message will be processed, etc.
            mode: SendPayFwdFeesSeparately | SendIgnoreErrors,

            // Whether to allow this message to bounce back to this contract
            // in case the recipient contract doesn't exist or wasn't able to
            // process the message.
            bounce: true, // to handle messages that bounced back, a special bounced
            //               receiver function is used. See the "Contract structure"
            //               lesson later on for more info.
        });
    }

    // The following will handle empty, \`null\` message bodies of the incoming
    // messages from other contracts. Such "empty" receivers are often used for
    // deployment purposes, as they do not need special message declarations
    // and are the most cheap to construct messages to.
    receive() { self.showcase() }
}`,
  koan: undefined,
};

// NOTE: consider using a simple parent-child contract system here as an example.
