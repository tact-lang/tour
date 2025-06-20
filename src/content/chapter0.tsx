import { type Chapter0, type Lesson, tact, ts } from "../types";
import { CodeBlock } from "../CodeBlock";

const home: Lesson = {
  url: "",
  title: "Welcome to the Tact language tour! WIP, come back later!",
  content: <>
    <p>
      Tact is a statically typed language designed specifically for TON blockchain smart contracts. It provides safety, efficiency, and ease of use while maintaining the power needed for complex smart contract development.
    </p>
    <p>
      This tour covers most aspects of the Tact language, and assuming you have some prior programming experience should teach you enough to write real smart contracts in Tact.
    </p>
    <p>
      The tour is interactive! The code shown is editable and will be compiled and evaluated as you type. Anything you print using <code>dump()</code> will be shown in the bottom section, along with any compile errors and warnings.
    </p>
    <CodeBlock
      code={ts`// WIP: This is here to test highlighting & friends
console.log(new Array(10).join(10 - "a") + " Batman!"); // a lot more text here to check the scroll`}
      lang="ts"
    />
    <CodeBlock
      code={tact`dump("Yay, Tact highlighting!");`}
    />
    <p>
      You can navigate through the tour using keyboard arrows ⬅️ and ➡️ or by clicking the buttons below the content. Beware that the changes made to the code are lost in transitions!
    </p>
  </>,
  quiz: undefined,
  code: tact`contract HelloWorld() {
    receive() {
        emit("Hello, World!".asComment());
        cashback(sender());
    }
}`,
  koan: undefined,
};

const last: Lesson = {
  url: "/what-next",
  title: "What next? ✨",
  content: (<>
    <p>
      It's been a joy to have you on the Tour of Tact. TON Studio and Tact teams sincerely hope you enjoy the journey ahead. If you have felt comfortable this far, we strongly recommend diving deeper with these resources:
    </p>
    <ul>
      <li><a href="https://docs.tact-lang.org">Official Tact documentation</a></li>
      <li><a href="https://github.com/tact-lang/awesome-tact">Awesome Tact</a></li>
      <li><a href="https://github.com/tact-lang/defi-cookbook">Tact DeFi Cookbook</a></li>
      <li><a href="https://github.com/tact-lang/tact#installation">Installation and local tooling setup</a></li>
    </ul>
    <p>
      Good luck on your coding adventure — let's write some ⚡ Tact!
    </p>
  </>),
  quiz: undefined,
  code: "// This is your personal playground, enjoy!",
  koan: undefined,
};

const chapter0: Chapter0 = { home, last };

export default chapter0;
