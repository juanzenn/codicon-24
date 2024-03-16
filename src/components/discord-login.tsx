"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function DiscordLogin() {
  return (
    <Button
      onClick={() => signIn("discord")}
      className="bg-discord text-discord-foreground gap-4 font-medium mx-auto flex mt-4"
    >
      <SiDiscord
        size={16}
        // @ This is needed because an error on the library lol
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      />
      Login with Discord
    </Button>
  );
}
