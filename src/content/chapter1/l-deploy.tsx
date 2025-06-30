import { type Lesson, tact } from "../../types";
// import { CodeBlock } from "../../CodeBlock";

export const lesson: Lesson = {
  url: "deploy",
  title: "Contract deployment",
  content: <>
    <p>
      TODO: use parent-child deploys here too.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Deployment() {
    fun showcase() {
        // Contract deployment is done by sending messages. For deployments,
        // one must send the new contract's initial state, i.e.,
        // its initial code and initial data, to its Address,
        // which is deterministically obtained from the initial state.
        deploy(DeployParameters {
            // Use initOf expression to provide initial code and data
            init: initOf MyContract(),
            // Attaching 1 Toncoin, which will be used to pay various fees
            value: ton("1"),
            // Notice that we do not need to explicitly specify the Address.
            // That's because it will be computed on the fly from the initial package.
        });
    }
}

// However, before your contracts can start deploying other contracts on-chain,
// it is common to first send an external message to your TON wallet from off-chain.
// Then, your wallet will be the contract that deploys the target one.

// An empty contract needed for the showcase above to work.
contract MyContract() {}`,
  koan: undefined,
};
