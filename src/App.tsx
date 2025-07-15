import React from "react";
import Editor from "@monaco-editor/react";
import {
  useHash,
  useHotkeys,
  useLocalStorage,
  useThrottledCallback,
} from "@mantine/hooks";
import type monaco from "monaco-editor/esm/vs/editor/editor.api";

import "./App.css";
import { type Lesson } from "./types";
import { type SrcInfo, OverwritableVirtualFileSystem, compile } from "./compilation";
import tactMonarchDefinition from "./tactMonarchDefinition";
import chapter0 from "./content/chapter0";
import chapter1 from "./content/chapter1";

const fs = new OverwritableVirtualFileSystem();
const lessons: Lesson[] = [
  chapter0.home,
  ...(chapter1.lessons.flatMap((lesson) => {
    lesson.url = "/" + chapter1.url.replace(/\//g, '') + "/" + lesson.url.replace(/\//g, '');
    return lesson;
  })),
  chapter0.last,
];

function App() {
  const [hash, setHash] = useHash();
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage<boolean>({
    key: 'theme',
    defaultValue: true,
  });

  const hashLessonIndex = lessons.findIndex((v) => v.url === hash.slice(1));
  const currentIndex = hashLessonIndex !== -1 ? hashLessonIndex : 0;
  const currentExample = lessons[currentIndex];

  React.useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', isDarkTheme);
    document.documentElement.classList.toggle('theme-light', !isDarkTheme);
  }, [isDarkTheme]);

  return (
    <div className="App">
      <nav className="navbar">
        <a href="/" className="logo">
          <img
            src="/logo-light.svg"
            alt="Tact Tour"
            className="logo-icon logo-light"
          />
          <img
            src="/logo-dark.svg"
            alt="Tact Tour"
            className="logo-icon logo-dark"
          />
        </a>
        <div className="nav-right">
          <a href="https://docs.tact-lang.org" className="link" target="_blank" rel="noopener noreferrer">
            Documentation
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
        <LeftPane
          currentExample={currentExample}
          currentIndex={currentIndex}
          setHash={setHash}
        />
        <RightPane
          defaultContent={currentExample.code}
          isDarkTheme={isDarkTheme}
        />
      </article>
    </div>
  );
}

type LeftPaneProps = {
  currentExample: Lesson;
  currentIndex: number;
  setHash: (value: string) => void;
};

function LeftPane({ currentExample, currentIndex, setHash }: LeftPaneProps) {
  const [showingContents, setShowingContents] = React.useState(false);
  const urlWithHash = (url: string) => "#" + url;

  const goNext = () => {
    if (showingContents) { return }
    if (currentIndex < lessons.length - 1) {
      setHash(lessons[currentIndex + 1].url);
    }
  };

  const goPrevious = () => {
    if (showingContents) { return }
    if (currentIndex > 0) {
      setHash(lessons[currentIndex - 1].url);
    }
  };

  const goContents = () => {
    if (showingContents) { return }
    setShowingContents(true);
  };

  const goLesson = () => {
    if (!showingContents) { return }
    setShowingContents(false);
    setHash(lessons[currentIndex].url);
  };

  const goUrl = (url: string) => {
    return () => {
      if (!showingContents) { return }
      setShowingContents(false);
      setHash(urlWithHash(url));
    }
  }

  useHotkeys([
    ['ArrowLeft', goPrevious],
    ['ArrowRight', goNext],
    ['ArrowUp', goContents],
    ['ArrowDown', goLesson],
  ], ['div.monaco-editor']);

  return (
    <section id="left" className="content-nav">
      {showingContents ? (<>
        <div>
          <h1>All contents 📜</h1>
          <div className="content-text">
            {/* <h2>Basics</h2> */}
            <ul>
              {chapter1.lessons.map(lesson => (
                <li key={lesson.url}>
                  <a
                    href={urlWithHash(lesson.url)}
                    onClick={goUrl(lesson.url)}
                  >
                    {lesson.title}
                  </a>
                </li>
              ))}
            </ul>
            <p><a
              href={urlWithHash(chapter0.last.url)}
              onClick={goUrl(chapter0.last.url)}
            >
              What's next...?
            </a></p>
          </div>
        </div>
        <nav className="prev-next">
          <button
            onClick={goLesson}
            className="nav-btn contents"
          >
            ⬇️ Back to the lesson
          </button>
        </nav>
      </>) : (<>
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
            {currentIndex === 0 ? 'Start' : '⬅️ Previous'}
          </button>
          <span>—</span>
          <button
            onClick={goContents}
            className="nav-btn contents"
          >
            ⬆️ Contents ({currentIndex + 1}/{lessons.length})
          </button>
          <span>—</span>
          <button
            onClick={goNext}
            disabled={currentIndex === lessons.length - 1}
            className="nav-btn"
          >
            {currentIndex === lessons.length - 1 ? 'Last' : 'Next ➡️'}
          </button>
        </nav>
      </>)}
    </section>
  );
}

type RightPaneProps = { defaultContent: string, isDarkTheme: boolean };

function RightPane({ defaultContent, isDarkTheme }: RightPaneProps) {
  const defaultOutput = "Use Ctrl/Cmd+S to compile and deploy!";
  const errorOutput = "Fix errors and press Ctrl/Cmd+S to recompile.";
  const rightOutput = "Compiled without errors!";
  // NOTE: consider moving the output state into the sub-component for the output itself
  const [output, setOutput] = React.useState(defaultOutput);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = React.useRef<typeof monaco>(null);

  // Removes markers from the editor
  const resetEditorMarkers = () => {
    if (!editorRef.current) return;
    if (!monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    monacoRef.current.editor.setModelMarkers(model, 'default', []);
  };

  // Will be executed at most every X seconds, even if it's called a lot.
  const throttledCompileDeployLoop = useThrottledCallback(async () => {
    if (!editorRef.current) return;
    if (!monacoRef.current) return;

    const model = editorRef.current.getModel();
    const code = editorRef.current.getValue(); // model.getValue();
    if (!model) return;
    fs.writeFile("editor.tact", code);
    const buildRes = await compile(fs);
    if (buildRes.ok) {
      monacoRef.current.editor.setModelMarkers(model, 'default', []);
      setOutput(rightOutput);
      return;
    }

    // console.log(buildRes);
    setOutput(errorOutput);
    monacoRef.current.editor.setModelMarkers(model, 'default', buildRes.error.map((v) => {
      const msgStart = v.message.indexOf(' ') + 1;
      const msgEnd = v.message.indexOf('\n');
      const msg = v.message.slice(
        msgStart !== -1 ? msgStart : 0,
        msgEnd !== -1 ? msgEnd : undefined,
      ) + `\n\nCompiled with Tact ${buildRes.version}`;

      const loc: SrcInfo | null = (v as any).loc;
      if (!loc) {
        return {
          startLineNumber: 2,
          endLineNumber: 0,
          startColumn: 0,
          endColumn: 0,
          severity: 8,
          message: msg,
        };
      }

      const lac = loc.interval.getLineAndColumn();
      return {
        startLineNumber: lac.lineNum,
        endLineNumber: lac.lineNum,
        startColumn: lac.colNum,
        endColumn: lac.colNum,
        severity: 8,
        message: msg,
      };
    }));
  }, 1100);

  // Handle changes of the default content
  React.useEffect(() => {
    resetEditorMarkers();
    // NOTE: once the button row will be generated,
    //       make sure to reset it here
    setOutput(defaultOutput);
  }, [defaultContent]);

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //   }, 1500);
  //   return () => clearInterval(interval);
  // });

  // Handle Ctrl/Cmd+s keypresses
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        throttledCompileDeployLoop();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return (<>
    <section id="right">
      <section id="editor">
        {/* NOTE: Web IDE usage: https://github.com/tact-lang/web-ide/blob/main/src/components/workspace/Editor/Editor.tsx */}
        {/* NOTE: TxTracer usage: https://github.com/tact-lang/TxTracer/tree/main/src/shared/ui/CodeEditor */}
        <Editor
          defaultLanguage="tact"
          defaultValue={undefined}
          value={defaultContent}
          theme={isDarkTheme ? "vs-dark-aug" : "vs-aug"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            bracketPairColorization: { enabled: true },
            lineNumbersMinChars: 3,
            padding: { top: 4 },
            renderLineHighlight: 'all',
          }}
          beforeMount={(monaco) => {
            monaco.languages.register({
              id: "tact",
              aliases: ["Tact"],
              extensions: [".tact"],
            });
            monaco.languages.setMonarchTokensProvider("tact", tactMonarchDefinition());
            monaco.languages.setLanguageConfiguration("tact", {
              comments: { lineComment: "//" },
              wordPattern: /([a-zA-Z$_][a-zA-Z0-9$_]*)/,
              brackets: [
                ["{", "}"],
                ["[", "]"],
                ["(", ")"]
              ],
              colorizedBracketPairs: [
                ["{", "}"],
                ["[", "]"],
                ["(", ")"]
              ],
              autoClosingPairs: [
                { open: "{", close: "}" },
                { open: "[", close: "]" },
                { open: "(", close: ")" },
                { open: "\"", close: "\"", notIn: ["string"] },
              ],
              surroundingPairs: [
                { open: "{", close: "}" },
                { open: "[", close: "]" },
                { open: "(", close: ")" },
                { open: "\"", close: "\"" },
              ],
              onEnterRules: [
                {
                  beforeText: /^\s*\/\/\/.*$/,
                  action: { indentAction: 0, appendText: "/// " },
                }
              ],
              folding: {
                markers: {
                  start: /^\s*\/\/ region:\b/,
                  end: /^\s*\/\/ endregion\b/
                }
              }
            });
            monaco.editor.defineTheme("vs-dark-aug", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: 'entity.name.function.tact', foreground: 'DCDCAA' },
                { token: 'constant.numeric', foreground: 'B5CEA8' },
              ],
              colors: {},
            });
            monaco.editor.defineTheme("vs-aug", {
              base: "vs",
              inherit: true,
              rules: [
                { token: 'entity.name.function.tact', foreground: '795E26' },
                { token: 'constant.numeric', foreground: '098658' },
              ],
              colors: {},
            });
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
          }}
          onChange={(_value, _ev) => {
            resetEditorMarkers();
            // throttledCompileDeployLoop();
          }}
        />
      </section>
      <aside id="output">
        {/* TODO: add the output buttons row w/ generated stuff */}
        {/*
          > Sent message X to sender()
          < Received message Y from self/...: {...contents...} */}
        {/* <div className="output-header">Output</div> */}
        <div className="output-content">
          <pre>{output}</pre>
        </div>
      </aside>
    </section>
  </>);
}

export default App;
