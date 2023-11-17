import React from "react";
import { LinkFooter } from "$fastro/components/link.tsx";

export default function (props: { version: string; path: string }) {
  return (
    <footer className="mt-auto pb-3">
      <nav className="nav nav-mastfoot justify-content-center">
        <LinkFooter link="/modules">
          Modules
        </LinkFooter>
        <LinkFooter link="/templates">
          Templates
        </LinkFooter>
        <LinkFooter link="/middlewares">
          Middlewares
        </LinkFooter>
        <LinkFooter link="https://deno.land/x/fastro">
          {props.version}
        </LinkFooter>
      </nav>
    </footer>
  );
}
