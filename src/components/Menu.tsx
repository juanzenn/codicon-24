"use client";

import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const MENU_ITEMS = [
  { href: "/members", label: "Family" },
  { href: "/memories", label: "Memories" },
  { href: "/albums", label: "Albums" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-accent py-2 px-6 shadow-sm border-b border-b-background/30 sticky top-0 flex justify-between items-center">
      <Link
        href="/dashboard"
        className="font-bold text-primary text-lg tracking-tighter hover:text-primary/80 transition-colors"
      >
        Heritage Keeper
      </Link>

      <ul className="flex justify-center items-center gap-4 py-2">
        {MENU_ITEMS.map(({ href, label }, i) => {
          const isSelected = pathname === href;

          return (
            <Link
              key={`${label}-${i}`}
              href={href}
              className="w-40 text-center"
            >
              <li
                key={label}
                className={cn(
                  "font-medium px-8 py-2 rounded-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors cursor-pointer",
                  isSelected && "bg-primary text-primary-foreground",
                )}
              >
                {label}
              </li>
            </Link>
          );
        })}
      </ul>

      <Button
        className="hover:bg-destructive hover:text-destructive-foreground gap-2"
        variant="ghost"
        onClick={() => signOut()}
      >
        <LogOut size={16} />
        Signout
      </Button>
    </nav>
  );
}
