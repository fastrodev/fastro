import React, { useState } from "react";

export function App() {
  const [msg, setMsg] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = new FormData(e.target as HTMLFormElement).get("id");
    console.log("FE: Form submitted, ID:", id);
    try {
      console.log("FE: Sending fetch to /signin");
      const res = await fetch("/signin", {
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
    <div
      style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>{msg || "Sign In"}</h1>
      <form onSubmit={login}>
        <input name="id" placeholder="ID" required style={{ padding: "8px" }} />
        <button
          type="submit"
          style={{ padding: "8px 16px", marginLeft: "8px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
