import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MSG_FILE = path.join(process.cwd(), "data", "contact-messages.json");

function ensure() {
  const dir = path.dirname(MSG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(MSG_FILE)) fs.writeFileSync(MSG_FILE, "[]", "utf-8");
}

export async function GET() {
  try {
    ensure();
    const data = JSON.parse(fs.readFileSync(MSG_FILE, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensure();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    let msgs: any[] = JSON.parse(fs.readFileSync(MSG_FILE, "utf-8"));
    msgs = msgs.filter((m) => m.id !== id);
    fs.writeFileSync(MSG_FILE, JSON.stringify(msgs, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}