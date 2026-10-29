import { put } from "@vercel/blob";

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const email = clean(body.email, 200).toLowerCase();
    const firstName = clean(body.firstName, 100);
    if (!firstName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ ok: false, error: "missing_name_or_email" });
      return;
    }
    if (!body.consent) {
      res.status(400).json({ ok: false, error: "consent_required" });
      return;
    }
    const lanes = ["help", "donor", "partner", "curious"];
    const record = {
      firstName,
      lastName: clean(body.lastName, 100),
      email,
      city: clean(body.city, 100),
      state: clean(body.state, 100),
      lane: lanes.includes(body.lane) ? body.lane : "curious",
      billType: clean(body.billType, 100),
      amountRange: clean(body.amountRange, 100),
      budgetRange: clean(body.budgetRange, 120),
      interests: Array.isArray(body.interests) ? body.interests.map((i) => clean(i, 40)).slice(0, 5) : [],
      consent: true,
      source: clean(body.source, 60) || "landing-page",
      test: body.test === true,
      submittedAt: new Date().toISOString()
    };
    const stamp = record.submittedAt.replace(/[:.]/g, "-");
    const suffix = Math.random().toString(36).slice(2, 8);
    const pathname = `signups/${stamp}-${suffix}.json`;
    await put(pathname, JSON.stringify(record, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("join failed", err);
    res.status(500).json({ ok: false, error: "save_failed" });
  }
}
