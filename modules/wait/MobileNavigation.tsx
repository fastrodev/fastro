import { JSX } from "preact";
import Navigation from "./Navigation.tsx";

interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface MobileNavigationProps {
  isOpen: boolean;
  navigationSections: NavigationSection[];
}

export default function MobileNavigation(
  { isOpen, navigationSections }: MobileNavigationProps,
): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div class="absolute top-full left-0 mt-2 w-64 z-50">
      <Navigation
        className="shadow-lg"
        navigationSections={navigationSections}
      />
    </div>
  );
}
