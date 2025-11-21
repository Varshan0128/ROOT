// src/components/GetEarlyAccess.tsx
import React, { useCallback, useState } from "react";
import "./get-early-access.css";

export default function GetEarlyAccess() {
  const [sending, setSending] = useState(false);

  const handleEarlyAccessSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value?.trim();
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value?.trim();
    const phone = (form.querySelector('input[name="phone"]') as HTMLInputElement)?.value?.trim();

    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const originalLabel = submitBtn?.innerHTML || "Send";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending…";
      }
      setSending(true);

      // keep your existing endpoint/logic here
      const SCRIPT_ENDPOINT = (window as any).__EARLY_ACCESS_ENDPOINT || "/api/early-access";
      const SECRET = (window as any).__EARLY_ACCESS_SECRET || "X8g4q9p_CHANGE_THIS";

      const res = await fetch(SCRIPT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _secret: SECRET, name, email, phone }),
      });

      const text = await res.text();
      let payload: any;
      try { payload = JSON.parse(text); } catch { payload = { success: res.ok, raw: text }; }

      const ok = res.ok && (payload?.status === "ok" || payload?.success === true || payload?.status === "success");

      if (!ok) throw new Error(payload?.message || payload?.error || payload?.raw || "Save failed");

      form.reset();
      if (submitBtn) submitBtn.innerHTML = "Sent ✓";
      alert("✅ Thanks! You are on the early access list.");
    } catch (err: any) {
      console.error("Early access submit error:", err);
      alert("❌ There was an error: " + (err?.message || err));
      if (submitBtn) submitBtn.innerHTML = originalLabel;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      setSending(false);
    }
  }, []);

  return (
    <section className="get-early-access" aria-labelledby="gea-heading">
      <div className="get-early-access-smoke" aria-hidden="true" />
      <div className="get-early-access-inner animate-in">
        <div className="gea-left">
          <h2 id="gea-heading" className="section-title">Join the future of intelligent innovation</h2>
          <p className="gea-sub">
            Be among the first to experience Hired AI — early access members get exclusive insights, beta invites,
            and direct mentorship from the Root team.
          </p>

          <ul className="gea-highlights" aria-hidden="true">
            <li>Early beta invites</li>
            <li>Exclusive product previews</li>
            <li>Priority mentorship</li>
          </ul>
        </div>

        <div className="gea-card" role="region" aria-label="Early access sign up">
          <form className="early-access-form" onSubmit={handleEarlyAccessSubmit}>
            <input className="ea-input" name="name" placeholder="Full name" aria-label="Full name" />
            <input className="ea-input" name="email" type="email" placeholder="Email address" aria-label="Email address" />
            <input className="ea-input" name="phone" placeholder="Phone (optional)" aria-label="Phone (optional)" />
            <button className="ea-submit" type="submit" aria-disabled={sending}>
              <span className="btn-inner">
                <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2z"></path>
                </svg>
                <span className="btn-text">{sending ? "Sending…" : "Get Early Access"}</span>
              </span>
            </button>
            <div className="form-note" aria-hidden="true">We’ll never share your contact info. No spam.</div>
          </form>
        </div>
      </div>
    </section>
  );
}
