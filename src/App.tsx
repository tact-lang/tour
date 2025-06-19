import React from "react";
import Editor from "@monaco-editor/react";
import { useHotkeys } from "@mantine/hooks";
import type { Lesson } from "./types";
// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import "./App.css";
import tactMonarchDefinition from "./tactMonarchDefinition";
import chapter0 from "./content/chapter0";
import chapter1 from "./content/chapter1";

const lessons: Lesson[] = [
  chapter0.home,
  ...(chapter1.lessons.flatMap((lesson) => {
    lesson.url = chapter1.url + "/" + lesson.url;
    return lesson;
  })),
  chapter0.last,
];

function App() {
  const themeState = localStorage.getItem('theme');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDarkTheme, setIsDarkTheme] = React.useState(themeState === null || themeState === 'dark');
  const currentExample = lessons[currentIndex];

  React.useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', isDarkTheme);
    document.documentElement.classList.toggle('theme-light', !isDarkTheme);
  }, [isDarkTheme]);

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
  currentExample: Lesson;
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
};

function LeftPane({ currentExample, currentIndex, setCurrentIndex }: LeftPaneProps) {
  const goNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Modal?
  const goContents = () => { };

  useHotkeys([
    ['ArrowLeft', goPrevious],
    ['ArrowRight', goNext],
  ], ['div.monaco-editor']);

  return (<>
    <section id="left" className="content-nav">
      <div>
        <h1>{currentExample.title}</h1>
        <div className="content-text">{currentExample.content}</div>
      </div>
      <nav className="prev-next">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="nav-btn"
        >
          {currentIndex === 0 ? 'Start' : 'Previous'}
        </button>
        <span>—</span>
        <button
          onClick={goContents}
          className="nav-btn contents"
        >
          Contents ({currentIndex + 1}/{lessons.length})
        </button>
        <span>—</span>
        <button
          onClick={goNext}
          disabled={currentIndex === lessons.length - 1}
          className="nav-btn"
        >
          {currentIndex === lessons.length - 1 ? 'Last' : 'Next'}
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

  // useHotkeys([
  //   ['mod + S', () => console.log("Saved!")],
  // ]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        console.log('Saved through a callback');
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

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
              monaco.languages.setMonarchTokensProvider("tact", tactMonarchDefinition());
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
