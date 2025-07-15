import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "send",
  title: "Sending messages",
  content: <>
    <p>
      To communicate with other contracts and to deploy new ones, you need to send messages.
      Tact provides many helper message-sending functions without requiring you to compose
      the convoluted message body cells manually:
    </p>
    <ul>
      <li><code><a href="https://docs.tact-lang.org/ref/core-send#send">send()</a></code> — the
        most versatile, but not the most efficient message-sending function.</li>
      <li><code><a href="https://docs.tact-lang.org/ref/core-send#message">message()</a></code> — the
        most efficient function for sending non-deploy messages.</li>
      <li><code><a href="https://docs.tact-lang.org/ref/core-send#deploy">deploy()</a></code> — the
        most efficient function for on-chain deployments.</li>
      <li><code><a href="https://docs.tact-lang.org/ref/core-send#cashback">cashback()</a></code> — sends
        an empty message with the excesses left in the incoming message to the specified recepient.</li>
      <li><code><a href="https://docs.tact-lang.org/ref/core-send#emit">emit()</a></code> — sends
        a message without a recepient for the purpose of logging and analyzing it later off-chain.</li>
    </ul>
    <p>
      Note that all message-sending functions only queue the messages when called.
      The actual processing and sending will be done in the next, action phase
      of the transaction, where many messages can fail for various reasons.
    </p>
    <p>
      For example, if the remaining value from the incoming message was used by
      the first function, the subsequent functions that would try to do the same
      will fail. The optional <code>SendIgnoreErrors</code> flag hides those failures
      and ignores the unprocessed messages. It's not a silver bullet, and you're
      advised to always double-check the message flow in your contracts.
    </p>
    <p>
      In total, there can be no more than 255 actions queued for execution,
      meaning that the maximum allowed number of messages sent per transaction is 255.
      Attempts to queue more throw an exception with an exit code 33 during the action
      phase: <code>Action list is too long</code>.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract SendingMessages() {
    fun showcase() {
        // To keep some amount of nanoToncoins on the balance,
        // use nativeReserve() prior to calling message-sending functions:
        nativeReserve(ton("0.01"), ReserveAtMost);

        // There are many message-sending functions for various cases.
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
            bounce: true, // to handle messages that bounced back,
            //               a special bounced receiver function is used.
        });

        // To do refunds and forward excess values from the incoming message
        // back to the original sender, use the cashback message-sending function:
        cashback(sender());
    }

    // The following is needed for the deployment.
    receive() { self.showcase() }
}`,
  koan: undefined,
};

