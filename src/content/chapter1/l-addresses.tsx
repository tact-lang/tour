import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "addresses",
  title: "Addresses",
  content: <>
    <p>
      Addresses of smart contracts on TON are deterministically obtained by combining the initial code and initial data.
    </p>
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
        addrComponents.workchain; // 0, basechain: the most commonly used workchain on TON
        addrComponents.address; //   ...lots of digits...

        // The workchain ID is...
        // The account ID or hash of an address is...
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};

// TODO.
