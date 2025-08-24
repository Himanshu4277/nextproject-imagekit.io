"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastOptions } from "react-toastify";

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
};

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastConfig);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
      });

      toast.success("Registration successful! Please log in.", toastConfig);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-36 w-full space-y-3 mx-auto bg-gray-600  min-h-[575px]">
      <form onSubmit={handleSubmit} className=" w-96 p-8 shadow-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
