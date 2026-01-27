"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<"Weak" | "Medium" | "Strong" | "">(
    ""
  );
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function checkStrength(p: string) {
    if (p.length < 6) return "Weak";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p))
      return "Strong";
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) return "Medium";
    return "Weak";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (strength === "Weak") {
      toast.error("Password is too weak");
      return;
    }

    const loadingId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      // const res = await fetch("/api/login", {
      //   method: "POST",
      //   body: form,
      // });

      // const data = await res.json();

      toast.dismiss(loadingId);
      setLoading(false);

      // if (!data?.success) {
      //   toast.error(data?.message || "Login failed");
      //   setError(data?.message || "Login failed");
      //   return;
      // }

      toast.success("Logged in successfully");
      window.location.href = "/client";
    } catch {
      toast.dismiss(loadingId);
      setLoading(false);
      toast.error("Something went wrong. Try again.");
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Client Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="text-xs text-gray-500 hover:text-black transition"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                setStrength(checkStrength(val));
              }}
              required
            />

           
            
          </div>

          {/* Error */}
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {/* Forgot */}
          <div className="flex items-center justify-end">
            <Link
              href="/forgotpass"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2.5 rounded-lg w-full cursor-pointer hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <span>Don&apos;t have an account?</span>
          <Link href="/client/register" className="text-blue-600 hover:underline ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
