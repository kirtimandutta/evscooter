"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button";
import { ColorSwatches } from "@/components/color-swatches";
import { useStudio } from "@/components/providers";
import { accessories, estimateDelivery, pinShortcuts } from "@/lib/data";
import { inr } from "@/lib/format";
import { cn, glass } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const steps = ["Colorway", "City", "Token"];

export function BookingDrawer() {
  const { bookingOpen, bookingIntent, closeBooking, colorway } = useStudio();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [upi, setUpi] = useState("");
  const [error, setError] = useState("");
  const [payState, setPayState] = useState<"idle" | "pending" | "done">("idle");
  const [token, setToken] = useState("");
  const titleId = useId();

  const delivery = estimateDelivery(pin);
  const nameOk = name.trim().length >= 2;
  const mobileOk = /^[6-9]\d{9}$/.test(mobile);
  const upiOk = /^[\w.-]{2,}@[\w.-]{2,}$/.test(upi.trim());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!bookingOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookingOpen, closeBooking]);

  const reset = () => {
    setStep(0);
    setPicked([]);
    setPin("");
    setName("");
    setMobile("");
    setUpi("");
    setError("");
    setPayState("idle");
    setToken("");
  };

  const close = () => {
    closeBooking();
    if (payState === "done") window.setTimeout(reset, 350);
  };

  const toggleAccessory = (id: string) => {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const next = () => {
    if (step === 1 && !delivery) {
      setError("Enter a 6-digit PIN code.");
      return;
    }
    setError("");
    setStep((value) => Math.min(2, value + 1));
  };

  const pay = () => {
    if (!nameOk || !mobileOk || !upiOk || !delivery) {
      setError("Name, a 10-digit mobile, and a UPI ID are required.");
      return;
    }
    setError("");
    setPayState("pending");
    window.setTimeout(() => {
      const stamp = Date.now().toString(36).slice(-6).toUpperCase();
      setToken(`AURA-${pin}-${stamp}`);
      setPayState("done");
    }, 1600);
  };

  if (!mounted) return null;

  const headline =
    bookingIntent === "testride" ? "Book a free home test ride" : "Reserve AURA Pulse";
  const lede =
    bookingIntent === "testride"
      ? "The ₹999 token schedules the ride and holds this colorway. It is refundable."
      : "A refundable token holds your build. Due today is ₹999.";

  return createPortal(
    <AnimatePresence>
      {bookingOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            type="button"
            aria-label="Close booking"
            className="absolute inset-0 bg-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            className={cn(
              glass,
              "absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-y-0 border-r-0 border-l shadow-[-24px_0_80px_rgba(0,0,0,0.55)]",
            )}
            data-lenis-prevent
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FF66]">AURA MOTORS</p>
                <h2 id={titleId} tabIndex={-1} className="mt-1 font-display text-2xl tracking-[-0.03em] text-white outline-none">
                  {headline}
                </h2>
              </div>
              <button type="button" onClick={close} className="rounded-full border border-white/15 p-2 text-white" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-2 px-5 pt-4 sm:px-6">
              {steps.map((label, index) => (
                <div key={label} className="flex-1">
                  <div className={cn("h-px", index <= step ? "bg-[#00FF66]" : "bg-white/15")} />
                  <p className={cn("mt-2 font-mono text-[10px] uppercase tracking-[0.16em]", index === step ? "text-[#00FF66]" : "text-[#A1A1AA]")}>
                    0{index + 1} {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {payState === "done" ? (
                <div className="flex h-full flex-col items-start justify-center py-8">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#00FF66] text-black shadow-[0_0_25px_#00FF66]">
                    <Check />
                  </span>
                  <p className="mt-6 font-display text-4xl tracking-[-0.04em] text-white">Token confirmed.</p>
                  <p className="mt-3 font-mono text-sm text-[#00FF66]">{token}</p>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
                    {colorway.name}
                    {delivery ? ` · ${delivery.city} · Delivery in ${delivery.days} Days` : ""}. A receipt for ₹999 is queued to your UPI app.
                  </p>
                  <Button className="mt-8" onClick={close}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-[#A1A1AA]">{lede}</p>

                  {step === 0 && (
                    <div className="mt-5 space-y-5">
                      <ColorSwatches variant="cards" />
                      <div className="space-y-2">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">Accessory pack</p>
                        {accessories.map((item) => {
                          const on = picked.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggleAccessory(item.id)}
                              className={cn(
                                "flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition",
                                on ? "border-[#00FF66] bg-[#00FF66]/10" : "border-white/10 hover:border-[#00FF66]/40",
                              )}
                            >
                              <span>
                                <span className="block text-sm text-white">{item.name}</span>
                                <span className="mt-1 block text-xs text-[#A1A1AA]">{item.copy}</span>
                              </span>
                              <span className="font-mono text-xs text-[#00FF66]">{inr(item.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="mt-5">
                      <label htmlFor="aura-pin" className="text-sm text-white">
                        PIN code
                      </label>
                      <input
                        id="aura-pin"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={pin}
                        placeholder="560001"
                        onChange={(event) => {
                          setPin(event.target.value.replace(/\D/g, "").slice(0, 6));
                          setError("");
                        }}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white outline-none focus:border-[#00FF66]/70"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pinShortcuts.map((city) => (
                          <button
                            key={city.pin}
                            type="button"
                            onClick={() => {
                              setPin(city.pin);
                              setError("");
                            }}
                            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-[#A1A1AA] hover:border-[#00FF66] hover:text-white"
                          >
                            {city.city}
                          </button>
                        ))}
                      </div>
                      {delivery && (
                        <div className="mt-6 rounded-2xl border border-[#00FF66]/30 bg-[#00FF66]/10 p-4">
                          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#00FF66]">{delivery.city}</p>
                          <p className="mt-2 font-display text-4xl tracking-[-0.04em] text-white">
                            Delivery in {delivery.days} Days
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <form
                      className="mt-5 space-y-4"
                      onSubmit={(event) => {
                        event.preventDefault();
                        pay();
                      }}
                    >
                      <Field id="aura-name" label="Name" value={name} onChange={setName} autoComplete="name" />
                      <Field
                        id="aura-mobile"
                        label="Mobile"
                        value={mobile}
                        onChange={(value) => setMobile(value.replace(/\D/g, "").slice(0, 10))}
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="98XXXXXXXX"
                      />
                      <Field
                        id="aura-upi"
                        label="UPI ID"
                        value={upi}
                        onChange={setUpi}
                        autoComplete="off"
                        placeholder="name@okaxis"
                      />
                      <div className="rounded-2xl border border-white/10 p-4">
                        <div className="flex justify-between text-sm text-[#A1A1AA]">
                          <span>{colorway.name}</span>
                          <span>Held</span>
                        </div>
                        {accessories
                          .filter((item) => picked.includes(item.id))
                          .map((item) => (
                            <div key={item.id} className="mt-2 flex justify-between text-sm text-[#A1A1AA]">
                              <span>{item.name}</span>
                              <span>{inr(item.price)} on delivery</span>
                            </div>
                          ))}
                        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-white">
                          <span>Due today</span>
                          <span className="font-bold text-[#00FF66]">₹999</span>
                        </div>
                      </div>
                    </form>
                  )}

                  {error && <p className="mt-4 font-mono text-xs text-[#A3E635]">{error}</p>}
                </>
              )}
            </div>

            {payState !== "done" && (
              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
                <Button variant="ghost" disabled={step === 0 || payState === "pending"} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                  Back
                </Button>
                {step < 2 ? (
                  <Button onClick={next}>Continue</Button>
                ) : (
                  <Button onClick={pay} disabled={payState === "pending"}>
                    {payState === "pending" ? "Contacting UPI…" : "Pay ₹999 via UPI"}
                  </Button>
                )}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm text-white">{label}</span>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00FF66]/70"
      />
    </label>
  );
}
