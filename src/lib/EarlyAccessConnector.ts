// src/lib/EarlyAccessConnector.ts
export type EarlyAccessForm = {
  name: string;
  email: string;
  phone?: string;
};

/**
 * IMPORTANT:
 * Replace with your actual Apps Script web app /exec URL
 * Example:
 * https://script.google.com/macros/s/AKfycbxTc5WF5u.../exec
 */
const SCRIPT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwiAmTGoVsYvEtlTuFjJhLxST6aauNnCawzUTEyclo26inBKHjVLtCR9dKY0uqJosOQ/execc";

export async function submitEarlyAccess(form: EarlyAccessForm) {
  const params = new URLSearchParams();
  params.append("name", form.name);
  params.append("email", form.email);
  if (form.phone) params.append("phone", form.phone);

  const res = await fetch(SCRIPT_ENDPOINT, {
    method: "POST",
    body: params.toString(),
  });

  const text = await res.text();
  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { ok: res.ok, raw: text };
  }

  return { ok: res.ok, status: res.status, payload };
}
