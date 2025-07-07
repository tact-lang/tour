import { type Lesson, tact } from "../../types";
import { CodeBlock } from "../../CodeBlock";

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
      Notice that the deployment message is sent to the address
      even before that address is considered <code>active</code>.
      In fact, it's the process of deployment that makes the address
      of the deployed contract active.
    </p>
    <p>
      Tact has a handy <code>deploy()</code> function that takes care of
      all the hassle of composing a deploment message from you, so you
      can focus on higher-level details. You don't even have to specify
      the address of the deployed contract — as with all TON smart contracts,
      its address is derived from the provided code and data for the deployment.
    </p>
    <CodeBlock
      code={tact`deploy(DeployParameters { init: initOf TargetContract(), value: ton("1") });`}
    />
    <p>
      Consecutive messages with the contract's initial state attached
      are perfectly valid — if the contract is already initialized,
      the sent state (initial code and data) will be ignored, and the remaining
      message data will be processed as usual.
    </p>
    <p>
      Thus, the common pattern is to always attach the initial state whenever your
      contract needs to deploy another contract. It saves you from redundant and flawed
      deployment status checks, since in a distributed contract environment like TON Blockchain
      you cannot rely on synchronous data retrieval approaches used in many other blockchains.
    </p>
    <p>
      This pattern and relatively small account state limits force the sharded contracts approach,
      where the first deployed contract is the main one, and all subsequent contract deployments
      and management is done from that main one. It often spawns a new child contract per each user's
      TON wallet contract, thus making the whole blockchain a part of your distributed contract network.
    </p>
    <p>
      Contract sharding is applied to almost all DeFi contracts on TON: Jettons (tokens), NFTs, and
      many more common contracts all work through contract sharding and a single managing contract.
    </p>
    <p>
      Yet, before your contracts can start deploying other contracts on-chain,
      it needs some kickstart. Usually, that is the task of external messages that are sent from
      your TON wallet management apps (off-chain) to your on-chain TON wallets, which then
      send the required internal message and deploy the target new contract.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Parent() {
    // The following is needed for the deployment of this contract.
    receive() { self.showcase() }

    // The following receiver performs deployments of the Child contract.
    receive(msg: DeployChild) {
        deploy(DeployParameters {
            // Use initOf expression to provide initial code and data
            init: initOf Child(msg.id),
            // Attaching 1 Toncoin, which will be used to pay various fees
            value: ton("1"),
            // Notice that we do not need to explicitly specify the Address.
            // That's because it will be computed on the fly from the initial package.
        });
        echo("Queued a message to deploy a child contract");
    }
}

// Dummy child contract, which returns the funds when deployed.
// The \`id\` state variable is important as without it we would
// be able to only deploy a single Child contract on the whole workchain
// as its prepared initial code and data would not change between deployments.
contract Child(id: Int) {
  receive() { cashback(sender()) }
}

// The message to send to the Parent.
message DeployChild { id: Int }

// Simple logging function that displays less info than the builtin dump() one
asm fun echo(something: String) { STRDUMP DROP }`,
  koan: undefined,
};
