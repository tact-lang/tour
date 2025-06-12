import type { Chapter0, Lesson } from "../types";

const home: Lesson = {
  url: "",
  title: "Welcome to the Tact language tour! WIP, come back later!",
  content: <>Tact is a statically typed language designed specifically for TON blockchain smart contracts. It provides safety, efficiency, and ease of use while maintaining the power needed for complex smart contract development.</>,
  quiz: undefined,
  code: `contract HelloWorld() {
    receive() {
        emit("Hello, World!".asComment());
        cashback(sender());
    }
}`,
  koan: undefined,
};

const last: Lesson = {
  url: "what-next",
  title: "What next? ✨",
  content: (<>
    <p>
      It's been a joy to have you on the Tour of Tact. Tact and TON Studio teams sincerely hope you enjoy the journey ahead! If you have felt comfortable this far, we strongly recommend diving deeper with these resources:
    </p>
    {/* <p>
      Congratulations on completing the tour! Here are some ideas for what to do next:
    </p> */}
    <ul>
      <li><a href="https://docs.tact-lang.org">Official Tact documentation</a></li>
      <li><a href="https://github.com/tact-lang/awesome-tact">Awesome Tact</a></li>
      <li><a href="https://github.com/tact-lang/defi-cookbook">Tact DeFi Cookbook</a></li>
      <li><a href="https://github.com/tact-lang/tact#installation">Installation and local tooling setup</a></li>
    </ul>
  </>),
  quiz: undefined,
  code: "// This is your personal playground, enjoy!",
  koan: undefined,
};

const chapter0: Chapter0 = { home: home, last: last };

export default chapter0;
