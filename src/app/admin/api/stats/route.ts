import { NextResponse } from "next/server";
import { getNews, getBids, getVacancies, getSubscribers } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const news = getNews();
    const bids = getBids();
    const vacancies = getVacancies();
    const subscribers = getSubscribers();

    // Count applications from file
    let appCount = 0;
    const appFile = path.join(process.cwd(), "data", "applications.json");
    if (fs.existsSync(appFile)) {
      const apps = JSON.parse(fs.readFileSync(appFile, "utf-8"));
      appCount = apps.length;
    }

    // Count contact messages from file
    let msgCount = 0;
    const msgFile = path.join(process.cwd(), "data", "contact-messages.json");
    if (fs.existsSync(msgFile)) {
      const msgs = JSON.parse(fs.readFileSync(msgFile, "utf-8"));
      msgCount = msgs.length;
    }

    const newsByMonth: Record<string, number> = {};
    news.forEach((n) => {
      const month = n.date?.substring(0, 7) || n.createdAt?.substring(0, 7) || "2026-06";
      newsByMonth[month] = (newsByMonth[month] || 0) + 1;
    });

    const recentActivity = [
      ...news.slice(0, 3).map((n) => ({
        type: "news" as const,
        message: `News: ${n.title.substring(0, 50)}`,
        date: n.createdAt,
      })),
      ...bids.slice(0, 2).map((b) => ({
        type: "bid" as const,
        message: `Bid ${b.status}: ${b.title.substring(0, 50)}`,
        date: b.createdAt,
      })),
      ...vacancies.slice(0, 2).map((v) => ({
        type: "vacancy" as const,
        message: `Vacancy: ${v.title.substring(0, 50)}`,
        date: v.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    return NextResponse.json({
      totalNews: news.length,
      totalBids: bids.length,
      totalVacancies: vacancies.length,
      totalSubscribers: subscribers.length,
      totalApplications: appCount,
      totalMessages: msgCount,
      openBids: bids.filter((b) => b.status === "Open").length,
      publishedNews: news.filter((n) => n.status === "published").length,
      newsByMonth,
      recentActivity,
    });
  } catch {
    return NextResponse.json({
      totalNews: 0, totalBids: 0, totalVacancies: 0, totalSubscribers: 0,
      totalApplications: 0, totalMessages: 0, openBids: 0, publishedNews: 0,
      newsByMonth: {}, recentActivity: [],
    });
  }
}