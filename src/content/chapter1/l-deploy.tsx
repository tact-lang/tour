import { type Lesson, tact } from "../../types";
// import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "deploy",
  title: "Contract deployment",
  content: <>
    <p>
      Contract deployment is done by sending messages:
      one must send the new contract's initial state, i.e.,
      its initial code and initial data, to its <code>Address</code>,
      which is deterministically obtained from the initial state.
    </p>
    <p>
      Consecutive messages with the contract's initial state
      Notice, that ...
      TODO: common pattern is to always use the deploy function, despite.
    </p>
    <p>
      TODO: use parent-child deploys here too.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Deployment() {
    fun showcase() {
        deploy(DeployParameters {
            // Use initOf expression to provide initial code and data
            init: initOf Deployment(),
            // Attaching 1 Toncoin, which will be used to pay various fees
            value: ton("1"),
            // Notice that we do not need to explicitly specify the Address.
            // That's because it will be computed on the fly from the initial package.
        });
    }

    // The following is needed for the deployment.
    receive() { self.showcase() }
}

// However, before your contracts can start deploying other contracts on-chain,
// it is common to first send an external message to your TON wallet from off-chain.
// Then, your wallet will be the contract that deploys the target one.
`,
  koan: undefined,
};
