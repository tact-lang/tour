import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "receive",
  title: "Receiving messages",
  content: <>
    <p>
      Contracts receive messages on their own, and then route it to the appropriate handler,
      if such handler exists. In Tact, they are called receiver functions.
    </p>
    <p>
      If you define a certain receiver function that handles certain kind of messages or its
      contents, messages that have corresponding bodies will be routed to that receiver for
      you to provide the further necessary handling logic.
    </p>
    <p>
      If the message came and there was no receiver to handle it, the transaction will fail
      with exit code 130: <code>Invalid incoming message</code>.
    </p>
    <p>
      Tact allows defining the following three main types of receivers:
    </p>
    <ul>
      <li><code>receive()</code> — internal message receivers, which are handling the messages send from one contract to another and never from off-chain world. Those are the most common messages on the blockchain.</li>
      <li><code>bounced()</code> — bounced internal message receivers, which are called when an outgoing message from this contract returns or "bounces" back to it due to some error on the recepient's side.</li>
      <li><code>external()</code> — external message receivers that handle messages without an internal blockchain sender address originating from the off-chain.</li>
    </ul>
    <p>
      Except for the <code>bounced()</code> message receivers which only work with binary internal messages, other internal or external message receivers can be defined to handle one of the following kinds of message bodies:
    </p>
    <ul>
      <li>
        The so-called empty receiver handles messages with no contents, i.e.,
        the <code>null</code> body. Note that as a function,
        its own body does not have to be empty.
      </li>
      <li>
        The specific string comments with the maximum length of 123 bytes are handled
        by the exact text receiver, <code>receive("...")</code>.
      </li>
      <li>
        The arbitrary string comments that were not handled by the exact text receiver
        are instead handled by the catch-all string receiver <code>receive(str: String)</code>.
      </li>
      <li>
        If the message body starts with a recognized 4 byte non-zero opcode,
        that internal message is handled with a corresponding binary
        receiver <code>receive(msg: CertainMsgStruct)</code>,
      </li>
      <li>
        or the catch-all slice receiver <code>receive(msg: Slice)</code> if there is
        no binary receiver for that opcode or the message was not handled by any other
        receiver declared prior to this one.
      </li>
    </ul>
    <p>
      Note that processing and distinguishing text receivers costs significantly more gas than processing binary ones, such as <code>receive(msg: MyMessage)</code>.
      Thus, prefer using binary receivers, especially in production environments.
    </p>
    <p>
      You can obtain the original, unprocessed message body by using the
      helper <code><a href="https://docs.tact-lang.org/ref/core-contextstate#inmsg">inMsg()</a></code> function
      from the Tact's standard library. It returns the <code>Slice</code> that can be empty,
      start with 4 zero bytes and represent a text comment, or start with 4 bytes with a non-zero
      message opcode representing a binary message which fields follow soonafter.
    </p>
  </>,
  quiz: undefined,
  code: tact`// This contract defines various kinds of receivers in their
// order of handling the corresponding incoming messages.
contract ReceivingMessages() {
    // For deployments, it is common to use the following receiver
    // often called an "empty receiver", which handles \`null\` (empty)
    // message bodies of internal messages.
    receive() {
        // Obtaining the original unprocessed message body
        // with the \`inMsg()\` function from Tact's stdlib.
        let body = inMsg();
        body.bits(); // 0, because the body is empty

        // Forwarding the remaining value in the
        // incoming message (surplus) back to the sender.
        cashback(sender());
    }

    // This exact text receiver handles the specific string comment "yeehaw!"
    receive("yeehaw!") {
        let body = inMsg();
        body.loadUint(32); // 0
        body.hash() == "yeehaw!".asSlice().hash(); // true
    }

    // This catch-all string receiver handles arbitrary string comments
    // that weren't handled by prior text or catch-all slice receivers.
    receive(str: String) {
        let body = inMsg();
        body.loadUint(32); // 0
        body == str.asSlice(); // true
    }

    // This binary message receiver handles the specific Emergency message.
    receive(msg: Emergency) {
        let body = inMsg();
        body.preloadUint(32); // 911
    }

    // Finally, this catch-all slice receiver handles arbitrary messages that
    // were not processed by prior receivers.
    receive(rawMsg: Slice) {
        let body = inMsg();
        body == rawMsg; // true
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

        // Messages cannot bounce twice, meaning that if the message has bounced
        // already, it won't bounce further upon any errors in the transaction.
    }

    // There is a fallback catch-all bounced message receiver too,
    // which processes all bounced messages that weren't handled by prior receivers.
    bounced(rawMsg: Slice) {
        let body = inMsg();
        body == rawMsg; // true
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
        acceptMessage();
    }
}

// Message struct with 123 as its 32-bit opcode.
message(123) MyMsg {
    someVal: Int as uint8;
}

// Message struct without fields but with 0x911 as its 32-bit opcode.
message(0x911) Emergency {}`,
  koan: undefined,
};
