import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/storage";

export async function GET() {
  try {
    const items = getAnnouncements();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const item = createAnnouncement(data);
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...fields } = data;
    const item = updateAnnouncement(id, fields);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const ok = deleteAnnouncement(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}