import { NextResponse } from "next/server";
import { getApplications, getApplicationById, getApplicationsByVacancyId, updateApplication, deleteApplication, seedDefaults } from "@/lib/storage";

seedDefaults();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const vacancyId = url.searchParams.get("vacancyId");
  if (id) {
    const item = getApplicationById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }
  if (vacancyId) {
    return NextResponse.json(getApplicationsByVacancyId(vacancyId));
  }
  return NextResponse.json(getApplications());
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const item = updateApplication(id, data);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const ok = deleteApplication(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}