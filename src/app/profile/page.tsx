"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CustomerProfile, getCustomerProfile } from "@/services/customerService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getCustomerProfile();
        setProfile(data);
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to load profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const displayName =
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Customer";

  return (
    <main
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                Customer Profile
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                {displayName}
              </h1>
              <p className="mt-2 text-sm text-black/70">
                Manage your contact details and rental preferences.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-semibold text-black underline-offset-4 hover:underline"
            >
              Home
            </Link>
          </div>

          {loading ? (
            <p className="rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/80">
              Loading profile...
            </p>
          ) : null}

          {!loading && error ? (
            <div className="rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/80">
              <p>{error}</p>
              <p className="mt-2">
                If you just logged in, make sure a token is stored and try
                again.
              </p>
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="grid gap-4">
              <div className="rounded-xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                  Contact
                </p>
                <p className="mt-3 text-base font-semibold text-black">
                  {profile?.email ?? "Email not set"}
                </p>
                <p className="mt-1 text-sm text-black/70">
                  {profile?.phone || profile?.contact || "Phone not set"}
                </p>
              </div>

              <div className="rounded-xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                  Address
                </p>
                <p className="mt-3 text-sm text-black/80">
                  {profile?.address ?? "No address provided."}
                </p>
              </div>

              <div className="rounded-xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                  Account
                </p>
                <p className="mt-3 text-sm text-black/80">
                  {profile?.id !== undefined && profile?.id !== null
                    ? `Customer ID: ${profile.id}`
                    : "Customer ID not available."}
                </p>
                <p className="mt-1 text-sm text-black/70">
                  {profile?.role ? `Role: ${profile.role}` : "Role not available."}
                </p>
                <p className="mt-1 text-sm text-black/60">
                  {profile?.createdAt
                    ? `Member since ${new Date(profile.createdAt).toLocaleDateString()}`
                    : "Member date not available."}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
