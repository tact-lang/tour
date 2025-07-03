import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "receive",
  title: "Receiving messages",
  content: <>
    <p>
      On TON, contracts cannot read each other's states and cannot synchronously
      call each other's functions. Instead, the actor model of communication is
      applied — contracts send or receive asynchronous messages that influence each other's state.
    </p>
    <p>
      Each message is a Cell with a well-defined, complex structure of serialization.
      However, Tact provides you with simple abstractions to send, receive, and
      (de)serialize messages to and from various structures.

      // TODO: message bodies
      // TODO: can be empty, no opcode, empty message body receiver or "empty receiver" for short.
      // TODO: receivers: All kinds and their order, on the left or on the right,
      //       see the inMsg() function
      // bounced messages, external messages, internal messages.
      // internal and external, where only first can bounce.
      // Or rather that external cannot revert/bounce, so the bounced are internal.
      // etc.
    </p>
  </>,
  quiz: undefined,
  code: tact`// Each message has a so-called message body,
// which can be represented by message structs with certain opcodes.
message(123) MyMsg { someVal: Int as uint8 }

// Messages can also omit their bodies, or have them be empty,
// in which case they won't have any opcode and could only be handled
// by the empty message body receiver or "empty receiver" for short.
//
// See the "Contracts and traits" section below for more info.

// Finally, sending messages is not free and requires
// some forward fees to be paid upfront.
contract Messaging() {
    // TODO: receivers()

    fun showcase() {
        // To keep some amount of nanoToncoins on the balance,
        // use nativeReserve() prior to calling message-sending functions:
        nativeReserve(ton("0.01"), ReserveAtMost);

        // There are many message-sending functions for various cases.
        // See the links given right after this code block.
        //
        // This is most general and simple function to send an internal message:
        message(MessageParameters {
            // Recipient address.
            to: address("UQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p9dz"),

            // Optional message body.
            body: null, // empty body, no opcodes, nothing

            // Some nanoToncoins to send, possibly none.
            value: 0, // do not attach any nanoToncoins to the message

            // Configure various modes of sending the message in regards to how
            // the funds will be charged, how message will be processed, etc.
            mode: SendPayFwdFeesSeparately | SendIgnoreErrors,

            // Whether to allow this message to bounce back to this contract
            // in case the recipient contract doesn't exist or wasn't able to
            // process the message.
            bounce: true, // to handle messages that bounced back, a special bounced
                          // receiver function is used. See the "Contracts and traits"
                          // section below for more info.
        });

        // To do refunds and forward excess values from the incoming message
        // back to the original sender, use the cashback message-sending function:
        cashback(sender());

        // Note that all message-sending functions only queue the messages when called.
        // The actual processing and sending will be done in the next, action phase
        // of the transaction, where many messages can fail for various reasons.
        //
        // For example, if the remaining value from the incoming message was used by
        // the first function, the subsequent functions that would try to do the same
        // will fail. The optional SendIgnoreErrors flag seen above hides those failures
        // and ignores the unprocessed messages. It's not a silver bullet, and you're
        // advised to always double-check the message flow in your contracts.
    }

    // The following is needed for the deployment.
    receive() { self.showcase() }
}

// Already bounced messages cannot be sent by any contract and are guaranteed
// to be received only by the current contract that did sent them as internal
// messages first.
//
// Additionally, external messages cannot be sent by the contract,
// only processed by it.
//
// To receive internal messages (bounced or sent directly) and external messages,
// provide corresponding receiver functions. See the "Contracts and traits"
// section below for more info.
//
// To organize child-parent contract message exchange, see the "Jetton contracts"
// section below.`,
  koan: undefined,
};
