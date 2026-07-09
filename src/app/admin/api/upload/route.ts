import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    ensureDir();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename to avoid collisions
    const ext = path.extname(file.name) || ".bin";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedName = `${Date.now()}_${safeName}`;
    const filePath = path.join(UPLOAD_DIR, storedName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      storedName: storedName,
      url: `/uploads/${storedName}`,
      originalName: file.name,
      size: file.size,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}