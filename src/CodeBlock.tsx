import React from "react";
import { type BundledLanguage, codeToHtml } from "shiki/dist/bundle-web.mjs";

// TODO: should take the theme of the surrounding website into account.
//       query the attributes on the <html> tag.

type CodeBlockProps = {
  code: string;
  lang?: 'tact' | BundledLanguage;
};

export function CodeBlock({ code, lang = "tact" }: CodeBlockProps) {
  const [html, setHtml] = React.useState("");

  React.useLayoutEffect(() => {
    async function highlight() {
      setHtml(await codeToHtml(code, {
        lang,
        theme: 'one-dark-pro',
      }));
    }

    highlight();
  }, [code, lang]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
