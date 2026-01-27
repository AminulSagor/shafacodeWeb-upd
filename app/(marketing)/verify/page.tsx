"use client";
import { useUser } from "@/context/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const forgot = searchParams.get("forgot");
  const { user, setUser } = useUser();

  const [code, setCode] = useState("");


  const verifyCode = async () => {
    toast.loading("Verifying...");
    if (!email) {
      toast.error("Invalid request")
      return;
    }

    if (code.length === 0) {
      toast.error("Please enter a verification code");
      return;
    }

    if (user.otp === code) {

      if (forgot === "true") {
        toast.dismiss();
        toast.success("Email verified! You can now reset your password.");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        return;
      }

      const res = await fetch("/api/register-db", {
        method: "POST",
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password,
          role: "employee",
          position: user.position,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.dismiss();
        toast.error(data.message || "Verification failed");
        return;
      }

      toast.dismiss();
      toast.success("Email verified successfully!");
      router.push("/upload-id");
      return;
    }

    toast.dismiss();
    toast.error("Invalid verification code");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="p-10 max-w-md mx-auto border rounded-lg">
        <h1 className="text-2xl text-center font-semibold mb-6">
          Verify Email
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Code sent to <b>{email}</b>
        </p>

        <input
          placeholder="Enter verification code"
          className="border p-2 w-full mb-4"
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={verifyCode}
          className="bg-black text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
