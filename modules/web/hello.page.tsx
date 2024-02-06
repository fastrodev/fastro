import { useState } from "preact/hooks";
import { PageProps } from "../../http/server/types.ts";

export default function Hello(
  { data }: PageProps<{ data: string; user: string; title: string }>,
) {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // You can also pass a callback to the setter
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
