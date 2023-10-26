import React from "react";
import { LinkFooter } from "./link.tsx";

export default function (props: { version: string; path: string }) {
  return (
    <footer className="mt-auto pb-3">
      <nav className="nav nav-mastfoot justify-content-center">
        <LinkFooter link="https://deno.land/x/fastro">
          Made with Fastro{"  "}{props.version}
        </LinkFooter>
      </nav>
    </footer>
  );
}
