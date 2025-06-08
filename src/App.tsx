import React from "react";
import Editor from "@monaco-editor/react";
// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import tactMonarchLanguage from "./tactMonarchLanguage";
import "./App.css";

interface Example {
  id: string;
  title: string;
  content: string;
  code: string;
}

const examples: Example[] = [
  {
    id: "welcome",
    title: "Welcome to the Tact language tour! WIP, come back later!",
    content: `Tact is a statically typed language designed specifically for TON blockchain smart contracts. It provides safety, efficiency, and ease of use while maintaining the power needed for complex smart contract development.`,
    code: `// Welcome to Tact!
// This is a simple "Hello World" contract

// Defining a contract
contract HelloWorld {
    // Listens to incoming Ping messages
    receive(msg: Ping) {
        // Sends a Pong reply message
        reply(Pong {}.toCell());
    }

    // Listens to incoming Hello messages
    receive(msg: Hello) {
        // Replies with the received Hello message
        reply(msg.toCell());
    }

    // Listens to incoming empty messages,
    // which are very handy and cheap for the deployments.
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }
}

// A helper inlined function to send binary messages.
// See the "Primitive types" section below for more info about cells.
inline fun reply(msgBody: Cell) {
    message(MessageParameters {
        to: sender(),
        value: 0,
        mode: SendRemainingValue | SendIgnoreErrors,
        body: msgBody,
    });
}

// Empty message structs with specified 32-bit integer prefix.
// See the "Structs and message structs" section below for more info.
message(1) Ping {}
message(2) Pong {}
message(3) Hello {}`
  },
  {
    id: "step-2",
    title: "WIP",
    content: `To be added.`,
    code: `// Defining a new Message type, which has one field
// and an automatically assigned 32-bit opcode prefix
message Add {
    // unsigned integer value stored in 4 bytes
    amount: Int as uint32;
}

// Defining a contract
contract SimpleCounter(
    // Persistent state variables of the contract:
    counter: Int as uint32, // actual value of the counter
    id: Int as uint32, // a unique id to deploy multiple instances
                       // of this contract in a same workchain
    // Their default or initial values are supplied during deployment.
) {
    // Registers a receiver of empty messages from other contracts.
    // It handles internal messages with null body
    // and is very handy and cheap for the deployments.
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    // Registers a binary receiver of the Add message bodies.
    receive(msg: Add) {
        self.counter += msg.amount; // <- increase the counter
        // Forward the remaining value in the
        // incoming message back to the sender.
        cashback(sender());
    }

    // A getter function, which can only be called from off-chain
    // and never by other contracts. This one is useful to see the counter state.
    get fun counter(): Int {
        return self.counter; // <- return the counter value
    }

    // Another getter function, but for the id:
    get fun id(): Int {
        return self.id; // <- return the id value
    }
}`
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDarkTheme, setIsDarkTheme] = React.useState(localStorage.getItem('theme') === 'dark');

  React.useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', isDarkTheme);
    document.documentElement.classList.toggle('theme-light', !isDarkTheme);
  }, [isDarkTheme]);

  const currentExample = examples[currentIndex];

  return (
    <div className="App">
      <nav className="navbar">
        <a href="/" className="logo">
          <span className="logo-icon">⚡</span>
          Tact Tour
        </a>
        <div className="nav-right">
          <a href="https://docs.tact-lang.org" className="link" target="_blank" rel="noopener noreferrer">
            docs.tact-lang.org
          </a>
          <div className="theme-picker">
            <button
              type="button"
              className={`theme-button ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <article id="playground">
        <LeftPane currentExample={currentExample} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        <RightPane defaultContent={currentExample.code} isDarkTheme={isDarkTheme} />
      </article>
    </div>
  );
}

type LeftPaneProps = {
  currentExample: Example;
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
};

function LeftPane({ currentExample, currentIndex, setCurrentIndex }: LeftPaneProps) {
  const goNext = () => {
    if (currentIndex < examples.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (<>
    <section id="left" className="content-nav">
      <div>
        <h2>{currentExample.title}</h2>
        <div className="content-text">
          {currentExample.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <nav className="prev-next">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="nav-btn"
        >
          {currentIndex === 0 ? 'Back' : 'Previous'}
        </button>
        <span>—</span>
        <button className="nav-btn contents">
          Contents ({currentIndex + 1}/{examples.length})
        </button>
        <span>—</span>
        <button
          onClick={goNext}
          disabled={currentIndex === examples.length - 1}
          className="nav-btn"
        >
          {currentIndex === examples.length - 1 ? 'End' : 'Next'}
        </button>
      </nav>
    </section>
  </>);
}

type RightPaneProps = { defaultContent: string, isDarkTheme: boolean };

function RightPane({ defaultContent, isDarkTheme }: RightPaneProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [output, _setOutput] = React.useState("(Soon) Save changes to re-compile and re-deploy...");
  const editorRef = React.useRef<any | null>(null);

  return (<>
    <section id="right">
      <section id="editor">
        <div className="editor-content">
          {/* NOTE: Web IDE usage: https://github.com/tact-lang/web-ide/blob/main/src/components/workspace/Editor/Editor.tsx */}
          <Editor
            defaultLanguage="tact"
            defaultValue={undefined}
            value={defaultContent}
            theme={isDarkTheme ? "vs-dark" : "vs"}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              bracketPairColorization: { enabled: true }
            }}
            beforeMount={(monaco) => {
              monaco.languages.register({ id: "tact" });
              monaco.languages.setMonarchTokensProvider("tact", tactMonarchLanguage());
            }}
            onMount={(editor, _monaco) => {
              editorRef.current = editor;
            }}
            onChange={(_value, _ev) => {
              if (!editorRef.current) return;
            }}
          />
        </div>
      </section>
      <aside id="output">
        {/* <div className="output-header">Output</div> */}
        <div className="output-content">
          <pre>{output}</pre>
        </div>
      </aside>
    </section>
  </>);
}

export default App;
