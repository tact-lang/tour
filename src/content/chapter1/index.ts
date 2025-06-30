import { type Chapter } from "../../types";
import { lesson as l1 } from "./l-types";
import { lesson as l2 } from "./l-integers";
import { lesson as l3 } from "./l-addresses";
import { lesson as l4 } from "./l-strings";
import { lesson as l5 } from "./l-cells";
import { lesson as l6 } from "./l-optionals";

const chapter: Chapter = {
  url: "basics", // or "fundamentals"
  lessons: [l1, l2, l3, l4, l5, l6],
};

export default chapter;
