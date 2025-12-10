import React, { useEffect, useState } from "react";
import { UpdatedForm } from "./UpdatedForm";

export const Form = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    let changeColor = document.getElementById("count");
    if (count > 0 && count < 5) {
      changeColor.style.color = "green";
    } else {
      changeColor.style.color = "black";
    }
  }, [count]);

  useEffect(() => {
    let initialName = document.getElementById("name");
    if (!initialName) return;

    if (name === "robin") {
      initialName.style.backgroundColor = "green";
    //   setError("");
    } else {
      initialName.style.backgroundColor = "white";
      if (name) {
        // setError("Name is not Valid");
      } else {
        // setError("");
      }
    }
  }, [name]);

  return (
    <>
      <div className="App">
        <button onClick={() => setCount(count + 1)}> Increment </button>
        <p id="count">{count}</p>
        <button onClick={() => setCount(count - 1)}> Decrement </button>
      </div>
      <div>
        <input id="name" type="text" value={name} onChange={handleChange} />
        {error && <p>{error}</p>}
      </div>
      <hr />
      <div>
        <UpdatedForm />
      </div>
    </>
  );
};

// Nice, this is already working for the requirement ✅
// Now let’s look at what’s *wrong/weird* with it from a React/clean-code POV.
// I’ll drop issues first, then (if you want next) we can refactor it properly.

// ### 2️⃣ Direct DOM manipulation (`document.getElementById`)

// ```js
// let changeColor = document.getElementById("count");
// changeColor.style.color = "green";
// ```
// and

// ```js
// let initialName = document.getElementById("name");
// initialName.style.backgroundColor = "green";
// ```

// This is the big one.

// * This goes **around** React instead of using its declarative model.
// * If the component renders multiple times or multiple `<Form />` components exist, those `id`s will clash and DOM lookups become buggy.
// * In SSR environments (Next.js), accessing `document` can blow up on the server.

// **React way** would be:

// * Use state + inline style/className
// * Or use `useRef` if you *really* need a direct DOM node

// Example idea (no need to change now, just conceptually):

// ```jsx
// <p
//   id="count"
//   style={{ color: count > 0 && count < 5 ? "green" : "black" }}
// >
//   {count}
// </p>
// ```

// and

// ```jsx
// <input
//   id="name"
//   style={{ backgroundColor: name === "robin" ? "green" : "white" }}
//   ...
// />
// ```

// No `getElementById`, no manual `style` mutations.

// ---

// ### 3️⃣ `id` usage inside a component

// You’ve got:

// ```jsx
// <p id="count">{count}</p>
// <input id="name" ... />
// ```

// This is fine **only** if `<Form />` is guaranteed to be used once.

// If someone mounts 2 forms on the same page:

// ```jsx
// <Form />
// <Form />
// ```

// you now have duplicate `id="count"` and `id="name"` in the DOM, which is invalid HTML and makes `getElementById` nondeterministic.

// Better to avoid `id` unless:

// * It’s needed for labels (`htmlFor`) or accessibility, and
// * You generate it uniquely per component (e.g. with a lib or `useId`).

// ---

// ### 4️⃣ Side effects + state updates could be simpler

// This part:

// ```js
// useEffect(() => {
//   let initialName = document.getElementById("name");
//   if (!initialName) return;

//   if (name === "robin") {
//     initialName.style.backgroundColor = "green";
//     setError("");
//   } else {
//     initialName.style.backgroundColor = "white";
//     if (name) {
//       setError("Name is not Valid");
//     } else {
//       setError("");
//     }
//   }
// }, [name]);
// ```

// Works, but:

// * You’re mixing:

//   * DOM mutation
//   * validation logic
//   * error state updates
//     all in one effect.
// * `error` is **fully derived** from `name`, so technically you don’t even need `error` in state. You could compute it inline from `name` in the render.

// Not “wrong”, just more complex than needed.

// ---

// ### 5️⃣ Case sensitivity / UX nitpick

// ```js
// if (name === "robin")
// ```

// * If the user types `"Robin"` or `"ROBIN"`, it’s treated as invalid.
// * That’s probably why you earlier said: *“When I typed Robin, the error is showing”*.

// If you want `"Robin"` to also work:

// ```js
// if (name.toLowerCase() === "robin")
// ```

// Again, not a bug, but UX-wise a bit strict.

// ---

// ### 6️⃣ `count` can go negative (if that matters)

// ```js
// <button onClick={() => setCount(count - 1)}> Decrement </button>
// ```

// * You can decrement forever into negatives.
// * If requirement says “counter should not go below 0”, you’d want:

// ```js
// onClick={() => setCount((c) => Math.max(0, c - 1))}
// ```

// Right now it’s logically fine, just something to be aware of.

// ---

// ### 7️⃣ Minor safety around `changeColor`

// ```js
// let changeColor = document.getElementById("count");
// if (count > 0 && count < 5) {
//   changeColor.style.color = "green";
// }
// ```

// If for some reason the element isn’t there (e.g. conditional rendering later), `changeColor` becomes `null` and `.style` will throw.

// You handled this correctly for `initialName`:

// ```js
// if (!initialName) return;
// ```

// but you didn’t do the same for `changeColor`. Not an issue *right now*, but brittle.

// ---

// ### Summary

// Your app **works** for the task, but:

// * You’re fighting React a bit with `document.getElementById` and manual DOM styling.
// * You’ve got redundant imports and IDs that don’t scale if `<Form />` is reused.
// * Some logic (error + colors) could be expressed in a cleaner, more “React-y” way via state/props instead of effects + DOM.

// If you want, next we can:

// * Keep the same behavior, but rewrite *just the styling parts* in a clean React way (no direct DOM access), so it’s production-ready.
