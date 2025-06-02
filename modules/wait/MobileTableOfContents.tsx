import { JSX } from "preact";
import TableOfContents from "./TableOfContents.tsx";

interface MobileTableOfContentsProps {
  isOpen: boolean;
}

export default function MobileTableOfContents(
  { isOpen }: MobileTableOfContentsProps,
): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div class="absolute top-full right-0 mt-2 w-64 z-50">
      <TableOfContents className="shadow-lg" />
    </div>
  );
}
