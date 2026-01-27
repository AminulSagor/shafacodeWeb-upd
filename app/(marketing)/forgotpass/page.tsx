"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const page = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    toast.loading("Sending verification email...");

    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;

    const check = await fetch("/api/checkemail", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const checkData = await check.json();

    if (!checkData.exists) {
      toast.dismiss();
      toast.error("User not found");
      return;
    }

    try {
      const otp = Math.floor(100000 + Math.random() * 900000);

      const res = await fetch("/api/send-code", {
        method: "POST",
        body: JSON.stringify({ email: email, otp }),
      });

      setUser({
        ...user,
        email: email,
        otp: otp.toString(),
      });
      toast.dismiss();
      const data = await res.json();
      if (data.success) {
        toast.success("Verification email sent successfully!");
        router.push(`/verify?email=${encodeURIComponent(email)}&forgot=true`);
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="p-10 max-w-md mx-auto flex flex-col justify-center border rounded-lg">
        <h1 className="text-2xl text-center font-semibold mb-6">
          Forgot Password
        </h1>

        <p className="text-center text-gray-600 mb-4">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          {/* {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>} */}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-2 w-full"
            required
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer"
          >
            Send verification email
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
