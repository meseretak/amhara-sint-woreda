import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PAGES_FILE = path.join(process.cwd(), "data", "custom-pages.json");

function ensure() {
  const dir = path.dirname(PAGES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PAGES_FILE)) fs.writeFileSync(PAGES_FILE, "[]", "utf-8");
}

function genId() {
  return `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export async function GET() {
  try {
    ensure();
    return NextResponse.json(JSON.parse(fs.readFileSync(PAGES_FILE, "utf-8")));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    ensure();
    const data = await request.json();
    const pages = JSON.parse(fs.readFileSync(PAGES_FILE, "utf-8"));
    const page = { ...data, id: genId(), createdAt: new Date().toISOString() };
    pages.push(page);
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
    return NextResponse.json(page, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensure();
    const data = await request.json();
    const { id, ...fields } = data;
    const pages: any[] = JSON.parse(fs.readFileSync(PAGES_FILE, "utf-8"));
    const idx = pages.findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    pages[idx] = { ...pages[idx], ...fields };
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
    return NextResponse.json(pages[idx]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensure();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    let pages: any[] = JSON.parse(fs.readFileSync(PAGES_FILE, "utf-8"));
    pages = pages.filter((p) => p.id !== id);
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}