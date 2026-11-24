import { Resend } from "resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "gorilasdemontana@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Gorilas de Montaña <onboarding@resend.dev>";

function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

function adminEmailHtml({ name, email, travelDate, groupSize, message, locations, packageLabel }) {
  const rows = [["Customer Name", name], ["Email", email], ["Package", packageLabel], ["Trip Locations", locations], ["Travel Date", travelDate], ["Group Size", groupSize], ["Message", message || "Not provided"]];
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f1eae0;color:#1d1814;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden"><tr><td align="center" style="padding:24px;background:#46563b;color:#fff"><strong style="font-size:24px">GORILAS DE MONTAÑA</strong><br><span style="font-size:13px">New Trip Request</span></td></tr><tr><td style="padding:24px"><h2 style="margin:0 0 16px;color:#46563b">Trip Request Details</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.map(([label, value]) => `<tr><td style="padding:9px 0;border-bottom:1px solid #e8e0d4;font-weight:bold;width:40%;color:#46563b">${label}</td><td style="padding:9px 0;border-bottom:1px solid #e8e0d4">${escapeHtml(value)}</td></tr>`).join("")}</table></td></tr></table></body></html>`;
}

function notification(iconUrl, content) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,.82);border:1px solid rgba(255,255,255,.9);border-radius:14px;box-shadow:0 8px 24px rgba(36,66,73,.16)"><tr><td style="padding:18px 20px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:25px"><img src="${escapeHtml(iconUrl)}" width="25" height="25" alt="Messages" style="display:block;border-radius:6px"></td><td style="padding-left:10px;font-size:14px;font-weight:bold;color:#30363a">Gorilas de Montaña</td><td align="right" style="font-size:12px;color:#777">now</td></tr></table></td></tr><tr><td style="padding:20px;font-size:17px;line-height:1.42;color:#30363a">${content}</td></tr></table>`;
}

function customerEmailHtml({ name, time, date, iconUrl }) {
  const booking = `Hello <strong>${escapeHtml(name)}</strong>,<br><br>Gorilas de Montana team received your booking. Expected communication from us within <strong>24 hours.</strong><br><br>Thank you for beginning your adventure with us.`;
  const privacy = "Gorilas de Montaña will never use your information publicly without your permission.";
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Booking Received — Gorilas de Montaña</title></head><body style="margin:0;padding:0;background:#e9efee;font-family:Georgia,'Times New Roman',serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9efee"><tr><td align="center" style="padding:30px 14px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:390px;background:#15191b;border:8px solid #15191b;border-radius:42px;box-shadow:0 24px 60px rgba(0,0,0,.28)"><tr><td style="padding:35px 22px 26px;background:#d8e3e1;border-radius:30px 30px 0 0"><table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:-25px auto 20px"><tr><td style="height:22px;width:100px;background:#15191b;border-radius:999px;font-size:0;line-height:0">&nbsp;</td></tr></table><div style="font-size:58px;font-weight:bold;line-height:1;letter-spacing:1px;text-align:center;color:#52737a">${time}</div><div style="font-size:23px;font-weight:bold;margin:11px 0 75px;letter-spacing:.3px;text-align:center;color:#52737a">${date}</div></td></tr><tr><td style="padding:0 22px 26px;background:#d8e3e1;border-radius:0 0 30px 30px">${notification(iconUrl, booking)}<div style="height:20px;line-height:20px">&nbsp;</div>${notification(iconUrl, privacy)}</td></tr></table></td></tr></table></body></html>`;
}

function publicOrigin(request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  return host ? `${protocol}://${host}` : "";
}

export async function POST(request) {
  try {
    if (!process.env.RESEND_API_KEY) return Response.json({ error: "Email service not configured" }, { status: 500 });
    const { name, email, travelDate, groupSize, message, locations, packageLabel } = await request.json();
    if (!name || !email || !travelDate || !groupSize) return Response.json({ error: "Missing required fields" }, { status: 400 });

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const date = new Intl.DateTimeFormat("en-GB", { weekday: "long", year: "numeric", month: "long", day: "2-digit" }).format(now);
    const iconUrl = `${publicOrigin(request)}/images/apple-message.png`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    await Promise.all([
      resend.emails.send({ from: FROM_EMAIL, to: [ADMIN_EMAIL], subject: `New Trip Request from ${name} — ${packageLabel}`, html: adminEmailHtml({ name, email, travelDate, groupSize, message, locations, packageLabel }) }),
      resend.emails.send({ from: FROM_EMAIL, to: [email], subject: "Booking Received — Gorilas de Montaña", html: customerEmailHtml({ name, time, date, iconUrl }) }),
    ]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
