import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { getVacancies, createApplication, seedDefaults } from "@/lib/storage";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "cv");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Default vacancies shown when storage is empty
const DEFAULT_VACANCIES = [
  { id: "vac-default-1", title: "Health Extension Workers (10 Positions)", department: "Health Office", type: "Full-Time", salary: "ETB 6,000 - 8,000", deadline: "July 25, 2026", description: "Provide community-level health services including maternal and child health, disease prevention, and health education across assigned kebeles.", requirements: "Diploma in Health or related field\nGood communication skills\nWillingness to work in rural areas\nAmharic language proficiency required", status: "Open", createdAt: "2026-06-20T10:00:00Z" },
  { id: "vac-default-2", title: "Primary School Teachers (15 Positions)", department: "Education Office", type: "Full-Time", salary: "ETB 8,000 - 12,000", deadline: "July 20, 2026", description: "Teach primary school students in assigned schools across the woreda. Prepare lesson plans, assess student progress, and participate in school activities.", requirements: "Bachelor's degree in Education\nTeaching certification preferred\nExperience with primary education\nStrong classroom management skills", status: "Open", createdAt: "2026-06-15T10:00:00Z" },
  { id: "vac-default-3", title: "Accountant (2 Positions)", department: "Finance Office", type: "Full-Time", salary: "ETB 10,000 - 15,000", deadline: "July 15, 2026", description: "Manage financial records, prepare budgets, process payments, and ensure compliance with government financial regulations.", requirements: "Bachelor's degree in Accounting or Finance\n2+ years experience in government accounting\nKnowledge of Ethiopian financial regulations\nComputer proficiency (PeachTree/IFMIS)", status: "Open", createdAt: "2026-06-10T10:00:00Z" },
  { id: "vac-default-4", title: "ICT Support Technician", department: "Administration", type: "Contract", salary: "ETB 8,000 - 10,000", deadline: "July 10, 2026", description: "Provide IT support for woreda offices, maintain computer systems, manage networks, and train staff on basic IT skills.", requirements: "Diploma or Degree in IT/Computer Science\nKnowledge of hardware and software troubleshooting\nNetworking basics\nGood problem-solving skills", status: "Open", createdAt: "2026-06-05T10:00:00Z" },
  { id: "vac-default-5", title: "Agricultural Development Agent", department: "Agriculture Office", type: "Full-Time", salary: "ETB 7,000 - 9,000", deadline: "July 30, 2026", description: "Work directly with farmers to promote modern agricultural practices, provide training on improved seeds and fertilizers, and support agricultural development programs.", requirements: "Diploma in Agriculture or related field\nExperience in extension services\nKnowledge of local farming practices\nMotorcycle license preferred", status: "Open", createdAt: "2026-05-28T10:00:00Z" },
  { id: "vac-default-6", title: "Water Technician", department: "Water Office", type: "Part-Time", salary: "ETB 4,000 - 6,000", deadline: "August 5, 2026", description: "Maintain and repair water supply systems including boreholes, hand pumps, and distribution networks across the woreda.", requirements: "Certificate or Diploma in Water Engineering\nExperience with water system maintenance\nWillingness to travel to remote kebeles", status: "Open", createdAt: "2026-05-20T10:00:00Z" },
];

export async function GET(request: Request) {
  try {
    seedDefaults();
    let vacancies = getVacancies().filter((v) => v.status !== "Closed");
    // Fall back to defaults if storage is empty
    if (vacancies.length === 0) vacancies = DEFAULT_VACANCIES;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (id) {
      const item = vacancies.find((v) => v.id === id);
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(item);
    }
    return NextResponse.json(vacancies);
  } catch {
    return NextResponse.json(DEFAULT_VACANCIES);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const vacancyId = formData.get("vacancyId") as string;
    const vacancyTitle = formData.get("vacancyTitle") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const education = formData.get("education") as string;
    const experience = formData.get("experience") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const cvFile = formData.get("cv") as File | null;

    if (!vacancyId || !fullName || !email || !phone || !cvFile) {
      return NextResponse.json({ error: "All required fields must be filled and CV must be uploaded" }, { status: 400 });
    }

    // Save CV file
    const fileExt = cvFile.name.split(".").pop() || "pdf";
    const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueName = `${vacancyId}-${Date.now()}-${safeName}`;
    const cvPath = path.join(UPLOAD_DIR, uniqueName);
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    fs.writeFileSync(cvPath, buffer);

    seedDefaults();
    const application = createApplication({
      vacancyId,
      vacancyTitle: vacancyTitle || "Unknown",
      fullName,
      email,
      phone,
      education,
      experience,
      coverLetter: coverLetter || "",
      cvPath: uniqueName,
      cvOriginalName: cvFile.name,
      status: "pending",
      notes: "",
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (e: any) {
    console.error("Application error:", e);
    return NextResponse.json({ error: e.message || "Failed to submit application" }, { status: 500 });
  }
}