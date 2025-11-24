"use client";

import { FaGithub } from "react-icons/fa";
import { signIn, useSession } from "@/lib/auth-client";

export function GitHubLoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return null;
  }

  const handleLogin = async () => {
    await signIn.social({
      provider: "github",
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 outline-none transition-colors border border-white/20 text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-xs md:text-sm tracking-normal whitespace-nowrap cursor-pointer backdrop-blur-sm"
    >
      <FaGithub className="h-4 w-4" />
      <span className="hidden sm:inline">Sign in with GitHub</span>
      <span className="sm:hidden">Sign in</span>
    </button>
  );
}

