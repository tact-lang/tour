import React from "react";

import "./App.css";

function App() {
  const [leftPaneWidth, setLeftPaneWidth] = React.useState(50); // Percentage
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

      setLeftPaneWidth(newWidthPercent);
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
        <div className="pane left-pane" style={{ width: `${leftPaneWidth}%` }}>
          <div className="pane-content">
            <h2>Left Pane</h2>

            <div className="card">
              <h3>Current Width</h3>
              <p>
                Left pane: <strong>{Math.round(leftPaneWidth)}%</strong>
                <br />
                Right pane: <strong>{Math.round(100 - leftPaneWidth)}%</strong>
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
            <h2>Right Pane</h2>

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
