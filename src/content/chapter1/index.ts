import { type Chapter } from "../../types";
import { lesson as l1 } from "./l-integers";
import { lesson as l2 } from "./l-addresses";
import { lesson as l3 } from "./l-strings";
import { lesson as l4 } from "./l-cells";
import { lesson as l5 } from "./l-optionals";

const chapter: Chapter = {
  url: "basics", // or "fundamentals"
  lessons: [l1, l2, l3, l4, l5],
};

export default chapter;
