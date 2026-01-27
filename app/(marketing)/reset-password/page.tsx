"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [strength, setStrength] = useState<"Weak" | "Medium" | "Strong" | "">("");

  function checkStrength(p: string) {
    if (p.length < 6) return "Weak";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p))
      return "Strong";
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) return "Medium";
    return "Weak";
  }

  const barWidth = useMemo(() => {
    if (strength === "Strong") return "w-full";
    if (strength === "Medium") return "w-2/3";
    if (strength === "Weak") return "w-1/3";
    return "w-0";
  }, [strength]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const newPass = (form.get("newPassword") as string) || "";
    const confirmPassword = (form.get("confirmPassword") as string) || "";

    if (!email) {
      toast.error("Email is missing. Please try again.");
      return;
    }

    if (checkStrength(newPass) === "Weak") {
      toast.error("Password is too weak");
      return;
    }

    if (newPass !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const loadingId = toast.loading("Resetting password...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: newPass, confirmPassword }),
      });

      const data = await res.json();
      toast.dismiss(loadingId);

      if (data.success) {
        toast.success("Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="p-10 max-w-md mx-auto flex flex-col justify-center border rounded-lg bg-white">
        <h1 className="text-2xl text-center font-semibold mb-6">
          Reset Password
        </h1>

        <p className="text-center text-gray-600 mb-4">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            className="border p-2 w-full rounded"
            value={newPassword}
            onChange={(e) => {
              const val = e.target.value;
              setNewPassword(val);
              setStrength(checkStrength(val));
            }}
            required
          />


          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="border p-2 w-full rounded"
            required
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-gray-900 transition"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/login"
            onClick={() => toast.success("Redirecting to login...")}
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
