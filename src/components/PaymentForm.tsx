"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPayment } from "@/services/paymentService";
import { PaymentMethod } from "@/types/payment";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaymentRequest {
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  rentalId: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardHolderName?: string;
  email?: string;
}
interface FormErrors { [key: string]: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCardNumber = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

const getCardType = (n: string): "visa" | "mastercard" | "amex" | null => {
  const r = n.replace(/\s/g, "");
  if (/^4/.test(r)) return "visa";
  if (/^5[1-5]/.test(r)) return "mastercard";
  if (/^3[47]/.test(r)) return "amex";
  return null;
};

const maskCard = (n: string) => {
  const r = n.replace(/\s/g, "");
  return r.length < 4 ? "•••• •••• •••• ••••" : `•••• •••• •••• ${r.slice(-4)}`;
};

// ─── Logos ────────────────────────────────────────────────────────────────────
const VisaLogo = () => (
  <svg viewBox="0 0 48 18" width="40" height="14" fill="none">
    <text x="0" y="14" fontFamily="serif" fontWeight="900" fontSize="17" fill="white" letterSpacing="-0.5">VISA</text>
  </svg>
);
const MCLogo = () => (
  <svg viewBox="0 0 40 26" width="40" height="26">
    <circle cx="14" cy="13" r="11" fill="#EB001B" />
    <circle cx="26" cy="13" r="11" fill="#F79E1B" />
    <path d="M20 4.5a11 11 0 0 1 0 17A11 11 0 0 1 20 4.5z" fill="#FF5F00" />
  </svg>
);
const AmexLogo = () => (
  <svg viewBox="0 0 48 18" width="40" height="14">
    <text x="0" y="14" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="1.5">AMEX</text>
  </svg>
);

// ─── 3D Card Preview ──────────────────────────────────────────────────────────
function CardPreview({ cardType, cardNumber, cardHolder, expiry, flipped, cvv, method }: {
  cardType: ReturnType<typeof getCardType>;
  cardNumber: string; cardHolder: string; expiry: string;
  flipped: boolean; cvv: string; method: "CREDIT_CARD" | "DEBIT_CARD";
}) {
  const Logo = cardType === "visa" ? VisaLogo : cardType === "mastercard" ? MCLogo : cardType === "amex" ? AmexLogo : null;
  return (
    <div style={{ perspective: "1200px", height: 185, marginBottom: "1.75rem" }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.65s cubic-bezier(.16,1,.3,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18, backfaceVisibility: "hidden",
          background: "linear-gradient(135deg, #1e1b4b 0%, #1e3a5f 50%, #0c4a6e 100%)",
          border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 25% 25%, rgba(99,102,241,0.2), transparent 55%)", pointerEvents: "none" }} />
          {/* Noise texture */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.03, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 29, background: "linear-gradient(135deg,#d4af37,#f5e27c,#b8860b)", borderRadius: 5, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", height: 1, width: "100%", top: "50%", background: "rgba(0,0,0,0.3)" }} />
              <div style={{ position: "absolute", width: 1, height: "100%", left: "50%", background: "rgba(0,0,0,0.3)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              {Logo && <Logo />}
              <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.12em" }}>
                {method === "CREDIT_CARD" ? "CREDIT" : "DEBIT"}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.05rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.88)", marginBottom: "1rem" }}>
              {maskCard(cardNumber.replace(/\s/g, ""))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Card Holder</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{cardHolder || "YOUR NAME"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Expires</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "JetBrains Mono, monospace" }}>{expiry || "MM/YY"}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18, backfaceVisibility: "hidden",
          background: "linear-gradient(135deg, #0c4a6e, #1e1b4b)", transform: "rotateY(180deg)",
          border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ height: 44, background: "#050505", margin: "1.25rem 0 0.75rem" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", padding: "0 1.5rem", gap: 4 }}>
            <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>CVV</span>
            <div style={{ background: "#fff", color: "#050505", borderRadius: 4, padding: "4px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", letterSpacing: "0.2em", minWidth: 60, textAlign: "center" }}>
              {cvv ? "•".repeat(cvv.length) : "•••"}
            </div>
          </div>
          {Logo && <div style={{ position: "absolute", bottom: 20, right: 20 }}><Logo /></div>}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 80%, rgba(99,102,241,0.12), transparent 55%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PaymentForm() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [rentalId, setRentalId] = useState("");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cvvFocused, setCvvFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isCard = method === "CREDIT_CARD" || method === "DEBIT_CARD";
  const cardType = getCardType(cardNumber);

  const METHODS = [
    { value: "CREDIT_CARD" as PaymentMethod, label: "Credit Card", short: "Credit", color: "#6366f1", shadowColor: "rgba(99,102,241,0.35)" },
    { value: "DEBIT_CARD" as PaymentMethod, label: "Debit Card", short: "Debit", color: "#0ea5e9", shadowColor: "rgba(14,165,233,0.35)" },
    { value: "CASH" as PaymentMethod, label: "Cash Payment", short: "Cash", color: "#10b981", shadowColor: "rgba(16,185,129,0.35)" },
  ];
  const active = METHODS.find((m) => m.value === method)!;

  function validate() {
    const e: FormErrors = {};
    if (!rentalId.trim()) e.rentalId = "Required";
    if (!amount || Number(amount) <= 0) e.amount = "Enter amount";
    if (isCard) {
      if (cardNumber.replace(/\s/g, "").length < 13) e.cardNumber = "Invalid card number";
      if (!cardHolder.trim()) e.cardHolder = "Required";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = "MM/YY";
      if (cvv.length < 3) e.cvv = "Invalid";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        paymentMethod: method,
        amount: Number(amount),
        currency: "LKR",
        bookingId: rentalId,
        ...(isCard && {
          cardNumber: cardNumber.replace(/\s/g, "").slice(-4).padStart(16, "*"),
          expiryDate: expiry,
          cvv: "***",
          cardHolderName: cardHolder,
          ...(email && { email }),
        }),
      };
      const res = await createPayment(payload as any);
      router.push(res.status === "SUCCESS" ? "/payment/success" : "/payment/failed");
    } catch { router.push("/payment/failed"); }
    finally { setLoading(false); }
  }

  const inputStyle = (hasErr: boolean, accent: string) => ({
    width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${hasErr ? "#ef4444" : "rgba(255,255,255,0.07)"}`,
    borderRadius: 11, padding: "0.75rem 0.9rem",
    fontFamily: "JetBrains Mono, monospace", fontSize: "0.875rem", color: "#e5e7eb",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  } as React.CSSProperties);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pf-input:focus { border-color: var(--acc) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--acc) 18%, transparent) !important; }
        .pf-input::placeholder { color: #2d3748; }
        .pf-slide { animation: pf-slide-in 0.4s cubic-bezier(.16,1,.3,1) both; }
        @keyframes pf-slide-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pf-mount { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pf-spin { to { transform: rotate(360deg); } }
        @keyframes pf-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .pf-method-tab { transition: all 0.22s cubic-bezier(.16,1,.3,1); }
        .pf-method-tab:hover { background: rgba(255,255,255,0.05) !important; }
        .pf-submit:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-2px); }
        .pf-submit:active:not(:disabled) { transform: translateY(0); }
        .pf-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .pf-submit { transition: transform 0.15s, filter 0.15s, box-shadow 0.15s; }
      `}</style>
<div style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "100vh"
}}>

      <div style={{
  fontFamily: "Outfit, sans-serif",
  minHeight: "100vh",
  height: "100vh", // ✅ force full viewport
  background: "#06060a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
}}>
        {/* Grid bg */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }} />
        {/* Ambient orbs */}
        <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", filter: "blur(110px)", top: -200, left: -150, background: `radial-gradient(circle, ${active.color}20, transparent 65%)`, transition: "background 0.8s ease", pointerEvents: "none" }} />
        <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", filter: "blur(90px)", bottom: -100, right: -80, background: `radial-gradient(circle, ${active.color}18, transparent 65%)`, transition: "background 0.8s ease", pointerEvents: "none" }} />

        {/* Card */}
        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 500,
          animation: mounted ? "pf-mount 0.7s cubic-bezier(.16,1,.3,1) both" : "none",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 28, padding: "2.25rem", backdropFilter: "blur(20px)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.025), 0 40px 80px rgba(0,0,0,0.55)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f5f5f7", letterSpacing: "-0.04em", lineHeight: 1.1 }}>Checkout</h1>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#374151", letterSpacing: "0.05em", marginTop: 5 }}>// secure · encrypted · fast</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 99, padding: "5px 11px", fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#34d399", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                <span style={{ width: 5, height: 5, background: "#10b981", borderRadius: "50%", animation: "pf-blink 2s infinite", display: "inline-block" }} />
                SSL SECURED
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Method tabs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, background: "rgba(0,0,0,0.3)", padding: 5, borderRadius: 18, border: "1px solid rgba(255,255,255,0.04)", marginBottom: "1.75rem" }}>
                {METHODS.map((m) => {
                  const isActive = method === m.value;
                  return (
                    <button key={m.value} type="button" className="pf-method-tab"
                      onClick={() => { setMethod(m.value); setErrors({}); }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                        padding: "0.75rem 0.4rem", border: "none", borderRadius: 13,
                        background: isActive ? `${m.color}15` : "transparent",
                        color: isActive ? "#f5f5f7" : "#4b5563", cursor: "pointer",
                        fontFamily: "Outfit, sans-serif",
                      }}>
                      <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: isActive ? `${m.color}22` : "rgba(255,255,255,0.04)", color: isActive ? m.color : "currentColor", transition: "all 0.22s" }}>
                        {m.value === "CREDIT_CARD" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="19" height="19"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" strokeLinecap="round" /></svg>
                        )}
                        {m.value === "DEBIT_CARD" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="19" height="19"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="16.5" cy="14.5" r="2" fill="currentColor" stroke="none" /><circle cx="19.5" cy="14.5" r="2" fill="currentColor" stroke="none" opacity="0.4" /></svg>
                        )}
                        {m.value === "CASH" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="19" height="19"><rect x="2" y="7" width="20" height="13" rx="1.5" /><circle cx="12" cy="13.5" r="2.5" /><path d="M6 10v7M18 10v7" strokeLinecap="round" /></svg>
                        )}
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{m.short}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card 3D preview */}
              {isCard && (
                <CardPreview
                  cardType={cardType} cardNumber={cardNumber} cardHolder={cardHolder}
                  expiry={expiry} flipped={cvvFocused} cvv={cvv}
                  method={method as "CREDIT_CARD" | "DEBIT_CARD"}
                />
              )}

              {/* Rental ID + Amount */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    Rental ID {errors.rentalId && <span style={{ color: "#f87171" }}>{errors.rentalId}</span>}
                  </label>
                  <input className="pf-input" style={{ ...inputStyle(!!errors.rentalId, active.color), "--acc": active.color } as React.CSSProperties}
                    placeholder="R-000000" value={rentalId} onChange={(e) => setRentalId(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    Amount {errors.amount && <span style={{ color: "#f87171" }}>{errors.amount}</span>}
                  </label>
                  <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: `1px solid ${amountFocused ? active.color : errors.amount ? "#ef4444" : "rgba(255,255,255,0.07)"}`, borderRadius: 11, overflow: "hidden", boxShadow: amountFocused ? `0 0 0 3px ${active.color}25` : "none", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                    <span style={{ padding: "0 0.8rem", fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#6b7280", background: "rgba(0,0,0,0.2)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>LKR</span>
                    <input type="number" style={{ flex: 1, border: "none", background: "transparent", padding: "0.75rem 0.7rem", fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", fontWeight: 500, color: "#f5f5f7", outline: "none", width: "100%" }}
                      placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                      onFocus={() => setAmountFocused(true)} onBlur={() => setAmountFocused(false)} min="0" step="0.01" />
                  </div>
                </div>
              </div>

              {/* Card fields */}
              {isCard && (
                <div key={method} className="pf-slide">
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "1.1rem 0" }} />

                  {/* Card number */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      Card Number {errors.cardNumber && <span style={{ color: "#f87171" }}>{errors.cardNumber}</span>}
                    </label>
                    <input className="pf-input" style={{ ...inputStyle(!!errors.cardNumber, active.color), "--acc": active.color } as React.CSSProperties}
                      placeholder="0000 0000 0000 0000" value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19} inputMode="numeric" />
                  </div>

                  {/* Cardholder */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      Cardholder Name {errors.cardHolder && <span style={{ color: "#f87171" }}>{errors.cardHolder}</span>}
                    </label>
                    <input className="pf-input" style={{ ...inputStyle(!!errors.cardHolder, active.color), "--acc": active.color } as React.CSSProperties}
                      placeholder="Full name as on card" value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())} />
                  </div>

                  {/* Email + Expiry + CVV */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div>
                      <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        Email <span style={{ color: "#2d3748" }}>(opt)</span>
                        {errors.email && <span style={{ color: "#f87171" }}>{errors.email}</span>}
                      </label>
                      <input type="email" className="pf-input" style={{ ...inputStyle(!!errors.email, active.color), "--acc": active.color } as React.CSSProperties}
                        placeholder="receipt@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        Expiry {errors.expiry && <span style={{ color: "#f87171" }}>{errors.expiry}</span>}
                      </label>
                      <input className="pf-input" style={{ ...inputStyle(!!errors.expiry, active.color), "--acc": active.color } as React.CSSProperties}
                        placeholder="MM/YY" value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5} inputMode="numeric" />
                    </div>
                    <div>
                      <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        CVV {errors.cvv && <span style={{ color: "#f87171" }}>{errors.cvv}</span>}
                      </label>
                      <input type="password" className="pf-input" style={{ ...inputStyle(!!errors.cvv, active.color), "--acc": active.color } as React.CSSProperties}
                        placeholder="•••" value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        onFocus={() => setCvvFocused(true)} onBlur={() => setCvvFocused(false)}
                        inputMode="numeric" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash info */}
              {method === "CASH" && (
                <div className="pf-slide">
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "1.1rem 0" }} />
                  <div style={{ border: "1px dashed rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.04)", borderRadius: 16, padding: "1.5rem", textAlign: "center", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>💵</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#f5f5f7", marginBottom: "0.4rem" }}>Pay at Location</div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.7 }}>
                      No card details required.<br />
                      Show your Rental ID at the counter to complete payment.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "1.25rem 0 1rem" }} />

              {/* Submit */}
              <button type="submit" disabled={loading} className="pf-submit"
                style={{
                  width: "100%", padding: "0.95rem",
                  background: `linear-gradient(135deg, ${active.color}, ${active.color}bb)`,
                  border: "none", borderRadius: 14,
                  fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 700,
                  color: "#fff", cursor: "pointer", letterSpacing: "0.01em",
                  boxShadow: `0 4px 28px ${active.shadowColor}`,
                  position: "relative", overflow: "hidden",
                }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "pf-spin 0.65s linear infinite" }} />
                    Processing…
                  </span>
                ) : (
                  method === "CASH"
                    ? "Confirm Reservation →"
                    : `Pay ${amount ? `LKR ${Number(amount).toLocaleString()}` : "Now"} →`
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#1f2937", letterSpacing: "0.05em" }}>
              {["256-bit SSL", "PCI DSS", "CVV never stored"].map((t, i) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  {i > 0 && <span style={{ color: "#111827" }}>·</span>}
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}