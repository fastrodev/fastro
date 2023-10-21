import React from "https://esm.sh/v133/react@18.2.0";
import { LinkFooter } from "./link.tsx";

export default function (props: { version: string; path: string }) {
  return (
    <footer className="mt-auto">
      <nav className="nav nav-mastfoot justify-content-center">
        <LinkFooter link="https://github.com/fastrodev/fastro">
          Repository
        </LinkFooter>
        <LinkFooter link="https://deno.land/x/fastro">
          Fastro{"  "}{props.version}
        </LinkFooter>
      </nav>
    </footer>
  );
}
