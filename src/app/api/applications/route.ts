import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");

function ensureDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

function readApps(): any[] {
  ensureDir();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeApps(apps: any[]) {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apps = readApps();
    const newApp = {
      id: Date.now().toString(),
      ...data,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    apps.push(newApp);
    writeApps(apps);
    return NextResponse.json({ success: true, id: newApp.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to submit application" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const apps = readApps();
    if (id) {
      const app = apps.find((a: any) => a.id === id);
      if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
      return NextResponse.json(app);
    }
    return NextResponse.json(apps);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to read applications" }, { status: 500 });
  }
}