import React, { useState } from "react";

export const UpdatedForm = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const countColor = count > 0 && count < 5 ? "green" : "black";
  const nameBgColor = name.toLowerCase() === "robin" ? "green" : "white";
  const error =
    name && name.toLowerCase() !== "robin" ? "Name is not Valid" : "";

  return (
    <>
      <div>
        <button onClick={() => setCount((c) => c + 1)}> Increment </button>
        <p style={{ color: countColor }}>{count}</p>
        <button onClick={() => setCount((c) => c - 1)}> Decrement </button>
      </div>

      <div>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          style={{ backgroundColor: nameBgColor }}
        />
        {error && <p>{error}</p>}
      </div>
    </>
  );
};
