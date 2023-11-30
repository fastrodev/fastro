import React from "react";
import { LinkFooter } from "$fastro/components/link.tsx";

export default function (props: { version: string; path: string }) {
  return (
    <footer className="mt-auto pb-3">
      <nav className="nav nav-mastfoot justify-content-center">
        <LinkFooter link="/benchmarks">
          Internal Benchmarks
        </LinkFooter>
      </nav>
    </footer>
  );
}
