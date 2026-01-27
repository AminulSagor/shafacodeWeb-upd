// app/client/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "", // ✅ optional
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const Register = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !confirmPassword) {
      toast.error("All fields are required (phone is optional)");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const loadingId = toast.loading("Creating account...");

    try {
      const res = await fetch("/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null, // ✅ optional
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Register failed");

      // save uid for upload step (prototype approach)
      localStorage.setItem("uid", data.uid);

      toast.dismiss(loadingId);
      toast.success("Account created!");
      router.push("/client/upload-id");
    } catch (err: any) {
      toast.dismiss(loadingId);
      toast.error(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 sm:p-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create your account, then upload your ID
          </p>
        </div>

        <form onSubmit={Register} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              placeholder="Your name"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="tel"
              placeholder="+8801XXXXXXXXX"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="text-xs text-gray-500 hover:text-black transition"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <input
              type={showPass ? "text" : "password"}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="text-xs text-gray-500 hover:text-black transition"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-type password"
              className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2.5 rounded-lg w-full hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center text-sm">
          <Link href="/client/login" className="text-gray-600 hover:text-black transition">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
