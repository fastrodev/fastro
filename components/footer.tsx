import { h } from "https://esm.sh/preact@10.16.0";
import { LinkFooter } from "./link.tsx";

export default function (props: { version: string; path: string }) {
  return (
    <footer className="mt-auto">
      <nav className="nav nav-mastfoot justify-content-center">
        <LinkFooter link="/benchmarks">Benchmarks</LinkFooter>
        <LinkFooter link="https://github.com/fastrodev/fastro">
          Github
        </LinkFooter>
        <LinkFooter link="https://deno.land/x/fastro">
          Fastro{"  "}{props.version}
        </LinkFooter>
      </nav>
    </footer>
  );
}
