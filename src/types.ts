import { JSX } from "react";

export type Lesson = {
  /** Without a prefix or postfix slash / */
  url: string;

  /** <h1>{title}</h1> */
  title: string;

  /** Contents of the left pane */
  content: JSX.Element;

  /** MCQ that can follow contents of the left pane */
  quiz: undefined; // NOTE: future-proofing

  /** Code of the right, editor pane */
  code: string;

  /**
   * An intentionally broken piece of code to fix.
   * Won't be a part of the initial release — just planned to be implemented in the future.
   */
  koan: undefined; // NOTE: future-proofing
};

/** Chapter is a collection of lessons with a same theme and the same URL prefix */
export type Chapter = {
  /**
   * Prefixes the lesson URLs
   * Should NOT be prefixed or postfixed with a slash /
   */
  url: string;
  lessons: Lesson[];
};

/**
 * Special chapter that has the lesson displayed on the home/index page
 * and the lesson displayed the last
 */
export type Chapter0 = {
  home: Lesson;
  last: Lesson;
}

/** Template literal for highlighting Tact code within strings */
export const tact = (strings: TemplateStringsArray, ...values: unknown[]): string => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
};

/** Template literal for highlighting TypeScript code within strings */
export const ts = (strings: TemplateStringsArray, ...values: unknown[]): string => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
};
