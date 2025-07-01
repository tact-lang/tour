import { type Chapter } from "../../types";
import { lesson as l1 } from "./l-types";
import { lesson as l2 } from "./l-integers";
import { lesson as l3 } from "./l-addresses";
import { lesson as l4 } from "./l-strings";
import { lesson as l5 } from "./l-cells";
import { lesson as l6 } from "./l-optionals";
import { lesson as l7 } from "./l-maps";
import { lesson as l8 } from "./l-structures";
import { lesson as l9 } from "./l-operators";
import { lesson as l10 } from "./l-expressions";
// "TODO" caret:
import { lesson as l11 } from "./l-statements";
import { lesson as l12 } from "./l-functions";
import { lesson as l13 } from "./l-messaging";
import { lesson as l14 } from "./l-contracts";
import { lesson as l15 } from "./l-constants";
import { lesson as l16 } from "./l-state";
import { lesson as l17 } from "./l-debug";
import { lesson as l18 } from "./l-deploy";
import { lesson as l19 } from "./l-counter";

const chapter: Chapter = {
  url: "basics", // or "fundamentals"
  lessons: [
    l1, l2, l3, l4, l5, l6, l7, l8,
    l9, l10, l11, l12, l13, l14, l15, l16,
    l17, l18, l19,
  ],
};

export default chapter;
