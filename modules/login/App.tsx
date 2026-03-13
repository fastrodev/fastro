import React, { useState } from "react";

export function App() {
  const [msg, setMsg] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = new FormData(e.target as HTMLFormElement).get("id");
    console.log("FE: Form submitted, ID:", id);
    try {
      console.log("FE: Sending fetch to /signin");
      const res = await fetch("/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: id }),
      });
      console.log("FE: Response status:", res.status);
      const data = await res.json();
      console.log("FE: Data from BE:", data);
      setMsg(data.message || data.error);
    } catch (err) {
      console.error("FE: Fetch error:", err);
      setMsg("Error: " + (err as Error).message);
    }
  };

  return (
    <div>
      <h1>
        {msg || "Login"}
      </h1>
      <form onSubmit={login}>
        <input
          name="id"
          placeholder="Enter your ID"
          required
        />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
