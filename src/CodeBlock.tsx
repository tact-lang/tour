import React from "react";
import {
  type BundledLanguage,
  type BundledTheme,
  bundledLanguages,
  createHighlighter,
} from "shiki/dist/bundle-web.mjs";
import grammarTact from './tactTextMateDefinition.json';

const themeDark: BundledTheme = 'one-dark-pro';
const themeLight: BundledTheme = 'one-light';
const hl = createHighlighter({
  themes: [themeDark, themeLight],
  langs: [
    bundledLanguages.javascript,
    bundledLanguages.typescript,
    grammarTact,
  ],
});

type CodeBlockProps = {
  code: string;
  lang?: 'tact' | BundledLanguage;
};

export function CodeBlock({ code, lang = "tact" }: CodeBlockProps) {
  const [html, setHtml] = React.useState("");

  React.useLayoutEffect(() => {
    async function highlight() {
      const res = (await hl).codeToHtml(code.trim(), {
        lang,
        themes: {
          dark: themeDark,
          light: themeLight,
        },
        defaultColor: false,
      });
      setHtml(res);
    }

    highlight();
  }, [code, lang]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
