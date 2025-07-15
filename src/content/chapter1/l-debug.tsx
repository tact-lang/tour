import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "debug",
  title: "Testing and debugging",
  content: <>
    <p>
      An exit code is an integer that indicates whether the transaction
      was successful and, if not — holds the code of the exception that occurred.
      They are the simplest litmus tests for your contracts,
      indicating what happened and, if you are lucky, where, and why.
    </p>
    <p>
      To fully understand what went wrong, you might need to read the TON Virtual
      Machine (TVM) execution logs when running contracts in the Sandbox.
      And to ensure that encountered issues won't happen again, do write tests
      in Tact and TypeScript using the Sandbox + Jest toolkit provided by
      the Blueprint framework or tact-template.
    </p>
    <p>
      See the relevant exhaustive page in Tact documentation: <a
        href="https://docs.tact-lang.org/book/debug/">Debugging and testing</a>.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Debugging() {
    get fun showcase() {
        try {
            dump(
                beginCell()
                .storeInt(0, 250)
                .storeInt(0, 250)
                .storeInt(0, 250)
                .storeInt(0, 250)
                .storeUint(0, 24) // oh no, we're trying to store 1024 bits,
                //                   while cells can only store up to 1023 bits!
            );
        } catch (exitCode) {
            // exitCode is 8, which means the cell overflow has happened somewhere.
            // However, there is no clear indication there just from the code alone —
            // you need to either view transaction logs or know many pitfalls in advance.
            //
            // Additionally, runtime computations aren't free and require gas to be spent.
            // The catch block can revert the state before the try block,
            // but it cannot revert the gas spent for computations in the try block.
        }

        // Contrary to this reactive approach, we can be proactive and state
        // our expectations upfront with require() function.
        // It will also throw an exit code, but this time we can map that exit code
        // onto the error message and trace our way back to the this call to require().
        require(now() >= 1000, "We're too early, now() is less than 1000");

        // Sometimes, its also helpful to log the events as they unfold to view
        // the data off-chain. Use the emit() message-sending function for this.
        emit("Doing X, then Y, currently at R".asComment());
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
