// EarlyAccessConnector.tsx
import React, { useState } from "react";

/**
 * Replace this with your real Google Apps Script web app /exec URL.
 * Example:
 * const SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbx.../exec";
 */
const SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbwiAmTGoVsYvEtlTuFjJhLxST6aauNnCawzUTEyclo26inBKHjVLtCR9dKY0uqJosOQ/exec";

type Props = {
  // optional: if you want to override endpoint when using the component
  endpoint?: string;
  className?: string;
};

export default function EarlyAccessConnector({ endpoint, className }: Props) {
  const url = endpoint || SCRIPT_ENDPOINT;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!url || url.includes("PASTE_YOUR_WEB_APP_EXEC_URL_HERE")) {
      setStatus("error");
      setMessage("SCRIPT_ENDPOINT is not set correctly. Paste your web app URL in code.");
      return;
    }

    const form = e.currentTarget;
    const name = (form.querySelector('input[name="name"]') as HTMLInputElement)
      .value?.trim();
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)
      .value?.trim();
    const phone = (form.querySelector('input[name="phone"]') as HTMLInputElement)
      .value?.trim();

    if (!name || !email) {
      setStatus("error");
      setMessage("Missing required fields: name or email.");
      return;
    }

    setStatus("sending");

    try {
      const params = new URLSearchParams();
      params.append("name", name);
      params.append("email", email);
      params.append("phone", phone || "");

      const res = await fetch(url, {
        method: "POST",
        body: params.toString(), // application/x-www-form-urlencoded (no preflight)
        // DO NOT add custom headers here if you want to avoid CORS preflight
      });

      const text = await res.text();
      let payload: any = null;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text, ok: res.ok };
      }

      if (!res.ok || payload?.status === "error") {
        const serverMsg =
          payload?.message || payload?.error || `Server returned ${res.status}`;
        setStatus("error");
        setMessage(`Sorry — we couldn't save your details. ${serverMsg}`);
        console.error("EarlyAccessConnector server error:", payload);
        return;
      }

      // success
      setStatus("success");
      setMessage("Thanks! You are on the early access list.");
      // clear fields
      (form.querySelector('input[name="name"]') as HTMLInputElement).value = "";
      (form.querySelector('input[name="email"]') as HTMLInputElement).value = "";
      (form.querySelector('input[name="phone"]') as HTMLInputElement).value = "";
    } catch (err: any) {
      console.error("EarlyAccessConnector fetch error:", err);
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      aria-live="polite"
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input
            name="name"
            className="w-full rounded-md p-3 bg-white/10"
            placeholder="Your full name"
            aria-label="Name"
            required
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            className="w-full rounded-md p-3 bg-white/10"
            placeholder="you@company.com"
            aria-label="Email"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <input
          name="phone"
          className="w-full rounded-md p-3 bg-white/10"
          placeholder="+91 98xxxx xxxx"
          aria-label="Phone"
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Submitting..." : "Get Early Access"}
        </button>
      </div>

      {message && (
        <div
          role={status === "error" ? "alert" : "status"}
          className={`mt-4 rounded-md px-4 py-3 ${
            status === "error"
              ? "bg-red-700/80 text-white"
              : status === "success"
              ? "bg-green-700/80 text-white"
              : "bg-yellow-700/80 text-white"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
