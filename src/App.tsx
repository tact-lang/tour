import React from "react";

import "./App.css";

function App() {
  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = React.useState(40);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      // @ts-ignore
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      let newWidthPercent = (mouseX / containerWidth) * 100;
      newWidthPercent = Math.max(40, Math.min(60, newWidthPercent));

      setLeftPaneWidthPercent(newWidthPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Tour of Tact</h1>

        <div className="theme-toggle">
          <span className="theme-icon sun-icon">☀️</span>
          <label htmlFor="theme-toggle">
            <input type="checkbox" id="theme-toggle" />
            <div className="switch"></div>
          </label>
          <span className="theme-icon moon-icon">🌙</span>
        </div>
      </header>

      <div
        className={`panes-container ${isDragging ? "dragging" : ""}`}
        ref={containerRef}
      >
        <div className="pane left-pane" style={{ width: `${leftPaneWidthPercent}%` }}>
          <div className="pane-content">
            <h2>Work in progress — come back later</h2>

            <div className="card">
              <h3>Current Width</h3>
              <p>
                Left pane: <strong>{Math.round(leftPaneWidthPercent)}%</strong>
                <br />
                Right pane: <strong>{Math.round(100 - leftPaneWidthPercent)}%</strong>
              </p>
            </div>

          </div>
        </div>

        <div
          className={`separator ${isDragging ? "dragging" : ""}`}
          onMouseDown={handleMouseDown}
        />

        <div className="pane right-pane">
          <div className="pane-content">
            {/*<h2>Code</h2>*/}

            <div className="card">
              <h3>"Hello, World!"</h3>
              <pre>
                <code>{`
// Single-line (//) comments for occasional and casual annotations

/// Documentation comments that support Markdown

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
message(3) Hello {}
                `}</code>
              </pre>
            </div>

            <div className="card">
              <h3>Here be dragons</h3>
              <p>
                Or code. Better be code.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
