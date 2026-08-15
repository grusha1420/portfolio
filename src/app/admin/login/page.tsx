"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = api.admin.login.useMutation({
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
    onError: (err) => {
      setError(
        err.data?.code === "UNAUTHORIZED"
          ? "Invalid password"
          : "Login failed. Please try again.",
      );
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    loginMutation.mutate({ password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-neutral-200 p-6"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <label className="flex flex-col gap-1 text-sm">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
