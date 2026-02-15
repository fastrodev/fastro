import React from "npm:react@^19.2.4";

export type AppProps = {
  name?: string;
  serverTime?: string;
};

export const App = (props: AppProps) => {
  const { name = "Guest", serverTime } = props;
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <h1>Hello {name}!</h1>
        {serverTime && <p>Server time: {serverTime}</p>}
        <p>
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            Count: {count}
          </button>
        </p>
        <p>
          Built with <strong>esbuild</strong> via <strong>Deno</strong>.
        </p>
      </main>
    </div>
  );
};
