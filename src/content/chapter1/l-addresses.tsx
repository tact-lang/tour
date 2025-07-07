import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "addresses",
  title: "Addresses",
  content: <>
    <p>
      Addresses of smart contracts on TON are deterministically obtained by combining the initial code and initial data.
    </p>
    <p>
      Addresses can be of three main kinds: standard internal, external "none", and regular external. External addresses denote off-chain participants, while internal ones represent on-chain actors.
    </p>
    <p>
      The most common, standard internal addresses are comprised of a workchain (or chain) ID, an 8-bit signed integer, and an account ID, a 256-bit unsigned integer. The account or hash ID is the unique identifier of a TON smart contract in a workchain.
    </p>
    <p>
      There are two workchains at the moment: masterchain (with ID -1), and basechain (with ID 0). Notice that in the future there could be more workchains with different lengths of the chain and hash IDs, and even variable-width lengths.
    </p>
    <p>
      Finally, each contract's address can be in one of four states:
    </p>
    <ul>
      <li>
        <code>nonexist</code> — either the contract was deleted or it does not exist on the chain yet.
      </li>
      <li>
        <code>uninit</code> — contract under this address has some balance and meta information stored on the blockchain, but either initial code, initial data, or both were not yet supplied.
      </li>
      <li>
        <code>active</code> — contract under this address has all the data of the <code>uninit</code> address plus the code and data, all stored on the blockchain.
      </li>
      <li>
        <code>frozen</code> — contract's storage fees exceeded the balance of this account for quite some time, and thus, the address for this contract became frozen. It won't process new messages until the balance is positive again after paying all the storage fee debts. If the contract won't unfreeze, it will be removed from the blockchain and the address will go into the <code>nonexist</code> state. To unfreeze the contract, use this <a href="https://unfreezer.ton.org/">official TON service</a>.
      </li>
    </ul>
  </>,
  quiz: undefined,
  code: tact`contract Addresses() {
    get fun showcase() {
        // Address of the current contract
        let myAddr: Address = myAddress();

        // You can parse the Address to view components of the standard address:
        // * a workchain ID: 8-bit signed Int
        // * and an account ID: 256-bit unsigned Int
        let addrComponents: StdAddress = parseStdAddress(myAddr.asSlice());
        echo(addrComponents.workchain); // 0, basechain: the most commonly used workchain on TON
        echo(addrComponents.address); //   ...lots of digits...
    }

    // The following is needed for the deployment.
    receive() {}
}

asm fun echo(something: String) { STRDUMP DROP }`,
  koan: undefined,
};
