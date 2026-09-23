"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/", "Home"],
  ["/food", "Food"],
  ["/charts", "Charts"],
  ["/photos", "Photos"],
  ["/research", "Research"],
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav>
      {LINKS.map(([href, label]) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
