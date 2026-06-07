"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6">
          Welcome to Nexus
        </h1>

        <button
          onClick={() => signIn("google")}
          className="w-full px-4 py-3 rounded-lg bg-white text-black font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}