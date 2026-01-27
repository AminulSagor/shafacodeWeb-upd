"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  function checkStrength(p: string) {
    if (p.length < 6) return "Weak";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p))
      return "Strong";
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) return "Medium";
    return "Weak";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (strength === "Weak") {
      toast.error("Password is too weak");
      return;
    }

    toast.loading("Logging in...");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/login", {
      method: "POST",
      body: form,
    });

    toast.dismiss();
    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
      setError(data.message);
    } else {
      toast.success("Logged in successfully");
      setError("");
      window.location.href = "/admin";
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="p-10 max-w-md mx-auto flex flex-col justify-center border rounded-lg bg-white shadow-sm">
        <h1 className="text-2xl text-center font-semibold mb-6">
          ShafaCode Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            className="border p-2 w-full rounded"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              setStrength(checkStrength(val));
            }}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="text-right">
            <Link href="/forgotpass" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span>Don&apos;t have an account?</span>

          <Link
            href="/register"
            className="text-blue-500 hover:underline ml-1"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
