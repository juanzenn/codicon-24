"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

export default function DiscordLogin() {
  const [pending, setPending] = React.useState(false);

  async function handleLogin() {
    setPending(true);
    await signIn("discord");
    setPending(false);
  }

  return (
    <Button
      onClick={handleLogin}
      className="bg-discord text-discord-foreground gap-4 font-medium mx-auto flex mt-4 w-60"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <SiDiscord
            size={16}
            // @ This is needed because an error on the library lol
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
          Login with Discord
        </>
      )}
    </Button>
  );
}
