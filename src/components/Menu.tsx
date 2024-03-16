"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  {
    href: "/members",
    label: "Members",
  },
  {
    href: "/albums",
    label: "Albums",
  },
  {
    href: "/memories",
    label: "Memories",
  },
  {
    href: "/proximity",
    label: "Proximity",
  },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <ul className="flex justify-center items-center gap-4 py-2">
        {MENU_ITEMS.map(({ href, label }, i) => (
          <li
            className={cn("p-2", {
              "text-blue-800 border-b-2 border-blue-800": href === pathname,
            })}
            key={`${label}-${i}`}
          >
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
