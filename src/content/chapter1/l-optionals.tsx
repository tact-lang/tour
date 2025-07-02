import { type Lesson, tact } from "../../types";

export const lesson: Lesson = {
  url: "optionals",
  title: "Optionals",
  content: <>
    <p>
      An optional is a value than can be of any type or <code>null</code>. Null is a special value that represents the intentional absence of any other value.
    </p>
    <p>
      You can make almost any variable or field optional by adding a question mark <code>?</code> after its type name. The only exceptions are <code>{"map<K, V>"}</code> and <code>{"bounced<Message>"}</code>, in which you cannot make the inner key/value type (in the case of a map) or the inner message struct (in the case of a bounced) optional.
    </p>
  </>,
  quiz: undefined,
  code: tact`contract Optionals() {
    get fun showcase() {
        // Type ascription of optionals is mandatory.
        let optionalVal: Int? = null;
        optionalVal = 255;

        // If you're certain that the value isn't null at a given moment,
        // use the non-null assertion operator !! to access it.
        dump(optionalVal!!);

        // If you are not certain, then it is better to explicitly compare
        // the value to null to avoid errors at runtime.
        if (optionalVal != null) {
            // here we go!
        } else {
            // not happening right now
        }
    }

    // The following is needed for the deployment.
    receive() {}
}`,
  koan: undefined,
};
