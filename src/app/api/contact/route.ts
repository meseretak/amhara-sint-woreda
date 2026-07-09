import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MSG_FILE = path.join(process.cwd(), "data", "contact-messages.json");

function ensure() {
  const dir = path.dirname(MSG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(MSG_FILE)) fs.writeFileSync(MSG_FILE, "[]", "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    ensure();
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    const msgs = JSON.parse(fs.readFileSync(MSG_FILE, "utf-8"));
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name, email, subject: subject || "(No Subject)", message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    msgs.unshift(newMsg);
    fs.writeFileSync(MSG_FILE, JSON.stringify(msgs, null, 2));
    return NextResponse.json({ success: true, message: "Your message has been received." });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}