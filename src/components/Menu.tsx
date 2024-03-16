"use client";

import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const MENU_ITEMS = [
  { href: "/members", label: "Members" },
  { href: "/albums", label: "Albums" },
  { href: "/memories", label: "Memories" },
  { href: "/proximity", label: "Proximity" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-accent py-2 px-6 shadow-sm border-b border-b-background/30 sticky top-0">
      <ul className="flex justify-center items-center gap-4 py-2">
        {MENU_ITEMS.map(({ href, label }, i) => {
          const isSelected = pathname === href;

          return (
            <li
              key={label}
              className={cn(
                "font-medium px-8 py-2 rounded-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors cursor-pointer",
                isSelected && "bg-primary text-primary-foreground",
              )}
            >
              <Link href={href}>{label}</Link>
            </li>
          );
        })}
      </ul>

      <Button
        className="fixed top-4 right-4 hover:bg-destructive hover:text-destructive-foreground gap-2"
        variant="ghost"
        onClick={() => signOut()}
      >
        <LogOut size={16} />
        Signout
      </Button>
    </nav>
  );
}
