import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "menus.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const defaultMenus = [
      { id: "1", label: "Home", href: "home", order: 0, children: [] },
      { id: "2", label: "About", href: "about-overview", order: 1, children: [
        { id: "2a", label: "History & Background", href: "about-history", order: 0 },
        { id: "2b", label: "Overview", href: "about-overview", order: 1 },
        { id: "2c", label: "Location & Geography", href: "about-location", order: 2 },
      ]},
      { id: "3", label: "Government", href: "gov-leadership", order: 2, children: [
        { id: "3a", label: "Leadership", href: "gov-leadership", order: 0 },
        { id: "3b", label: "Administrative Structure", href: "gov-structure", order: 1 },
        { id: "3c", label: "Offices & Departments", href: "gov-offices", order: 2 },
      ]},
      { id: "4", label: "Services", href: "svc-education", order: 3, children: [
        { id: "4a", label: "Education", href: "svc-education", order: 0 },
        { id: "4b", label: "Health", href: "svc-health", order: 1 },
        { id: "4c", label: "Agriculture", href: "svc-agriculture", order: 2 },
        { id: "4d", label: "Transport", href: "svc-transport", order: 3 },
        { id: "4e", label: "Water & Sanitation", href: "svc-water", order: 4 },
        { id: "4f", label: "Justice & Security", href: "svc-justice", order: 5 },
        { id: "4g", label: "Finance & Revenue", href: "svc-finance", order: 6 },
      ]},
      { id: "5", label: "Vacancy", href: "vacancy", order: 4, children: [] },
      { id: "5b", label: "Submit CV", href: "submit-cv", order: 5, children: [] },
      { id: "6", label: "Announcements", href: "news-announcements", order: 6, children: [
        { id: "6a", label: "News", href: "news-news", order: 0 },
        { id: "6b", label: "Bids & Tenders", href: "bids", order: 1 },
        { id: "6c", label: "Events", href: "news-announcements", order: 2 },
        { id: "6d", label: "Announcements", href: "news-announcements", order: 3 },
      ]},
      { id: "7", label: "Gallery", href: "gallery", order: 7, children: [] },
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultMenus, null, 2));
  }
}

export async function GET() {
  try {
    ensureDataDir();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read menus" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    ensureDataDir();
    const menus = await request.json();
    fs.writeFileSync(DATA_FILE, JSON.stringify(menus, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save menus" }, { status: 500 });
  }
}