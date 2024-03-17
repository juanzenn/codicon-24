"use client";

import { cn } from "@/lib/utils";
import { PopoverClose, PopoverContent } from "@radix-ui/react-popover";
import { LogOut, MenuIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger } from "./ui/popover";

const MENU_ITEMS = [
  { href: "/members", label: "Family" },
  { href: "/memories", label: "Memories" },
  { href: "/albums", label: "Albums" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden lg:flex w-full bg-accent py-2 px-6 shadow-sm border-b border-b-background/30 sticky top-0 justify-between items-center">
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

      <nav className="flex lg:hidden w-full bg-accent py-2 px-6 shadow-sm border-b border-b-background/30 sticky top-0 justify-between items-center">
        <Link
          href="/dashboard"
          className="font-bold text-primary text-lg tracking-tighter hover:text-primary/80 transition-colors"
        >
          Heritage Keeper
        </Link>

        <Popover>
          <PopoverTrigger>
            <Button variant="ghost">
              <MenuIcon size={24} className="text-primary" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-40 bg-accent px-4 py-2 rounded-md shadow border border-border"
            align="end"
            sideOffset={8}
          >
            <ul className="flex flex-col justify-start gap-2 py-2">
              {MENU_ITEMS.map(({ href, label }, i) => {
                const isSelected = pathname === href;

                return (
                  <Link
                    key={`${label}-${i}`}
                    href={href}
                    className="w-full text-left"
                  >
                    <li
                      key={label}
                      className={cn(
                        "font-medium p-4 py-2 rounded-lg hover:bg-primary/80 hover:text-primary-foreground transition-colors cursor-pointer",
                        isSelected && "bg-primary text-primary-foreground",
                      )}
                    >
                      {label}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </nav>
    </>
  );
}
