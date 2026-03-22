"use client";

import { useState } from "react";
import Link from "next/link";
import { registerCustomer } from "@/services/customerService";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await registerCustomer({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
        address,
        contact: phone || email,
        name: `${firstName} ${lastName}`.trim(),
      });

      setMessage("Registration successful.");
    } catch (caught) {
      const errorMessage =
        caught instanceof Error ? caught.message : "Registration failed.";
      setError(errorMessage || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-black/60">
              Customer Access
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-black/70">
              Register to manage bookings, payments, and rental history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>First name</span>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black/50"
                />
              </label>

              <label className="space-y-2 text-sm font-medium">
                <span>Last name</span>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black/50"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium">
              <span>Email</span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black/50"
              />
            </label>

            <label className="space-y-2 text-sm font-medium">
              <span>Password</span>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black/50"
              />
            </label>

            <label className="space-y-2 text-sm font-medium">
              <span>Address</span>
              <input
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black/50"
              />
            </label>

            <label className="space-y-2 text-sm font-medium">
              <span>Phone (optional)</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black/50"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="flex items-center justify-between text-sm text-black/70">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="font-semibold text-black underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>
          </form>

          {message ? (
            <p className="mt-6 rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/80">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/80">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
