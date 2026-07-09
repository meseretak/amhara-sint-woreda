import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");

function ensure() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export async function GET() {
  try {
    ensure();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensure();
    const { id, status } = await request.json();
    const apps: any[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const idx = apps.findIndex((a) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    apps[idx].status = status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2));
    return NextResponse.json(apps[idx]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensure();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    let apps: any[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    apps = apps.filter((a) => a.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}