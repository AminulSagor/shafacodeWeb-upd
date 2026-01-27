"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
    position: "nextjs",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState<"Weak" | "Medium" | "Strong" | "">(
    ""
  );

  function checkStrength(p: string) {
    if (p.length < 6) return "Weak";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p))
      return "Strong";
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) return "Medium";
    return "Weak";
  }

  const strengthBarWidth = useMemo(() => {
    if (strength === "Strong") return "w-full";
    if (strength === "Medium") return "w-2/3";
    if (strength === "Weak") return "w-1/3";
    return "w-0";
  }, [strength]);

  const strengthColor = useMemo(() => {
    if (strength === "Strong") return "bg-green-500 text-green-600";
    if (strength === "Medium") return "bg-yellow-500 text-yellow-600";
    if (strength === "Weak") return "bg-red-500 text-red-600";
    return "bg-gray-200 text-gray-500";
  }, [strength]);

  const Register = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.position) {
      toast.error("All fields are required");
      return;
    }

    if (strength === "Weak") {
      toast.error("Password is too weak");
      return;
    }

    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const loadingId = toast.loading("Registering...");

    try {
      const check = await fetch("/api/checkemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const checkData = await check.json();

      if (checkData.exists) {
        toast.dismiss(loadingId);
        toast.error("Email already registered");
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();

      setUser({
        ...user,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        position: form.position,
        otp: otp.toString(),
      });

      toast.dismiss(loadingId);

      if (data.success) {
        toast.success("OTP sent successfully!");
        router.push(`/verify?email=${encodeURIComponent(form.email)}`);
      } else {
        toast.error(data.message || "Failed to send OTP");
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
          ShafaCode Register
        </h1>

        <form onSubmit={Register} className="space-y-4">
          <input
            placeholder="Username"
            className="border p-2 w-full rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            placeholder="Email"
            className="border p-2 w-full rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <select
            className="border p-2 w-full rounded"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          >
            <option value="Next.js">NextJS Developer</option>
            <option value="Flutter">Flutter Developer</option>
            <option value="IoT">IoT Developer</option>
            <option value="UI/UX">UI/UX Designer</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full rounded"
            value={form.password}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, password: val });
              setStrength(checkStrength(val));
            }}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 w-full rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="text-blue-500 hover:underline ml-1 cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
