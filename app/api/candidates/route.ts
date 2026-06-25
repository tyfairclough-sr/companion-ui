import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const job = await prisma.jobPosting.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!job) {
    return NextResponse.json({ error: "No job posting found" }, { status: 404 });
  }

  const rows = await prisma.jobCandidate.findMany({
    where: { jobId: job.id },
    include: { candidate: true },
    orderBy: { candidate: { createdAt: "asc" } },
  });

  return NextResponse.json({
    jobId: job.id,
    candidates: rows.map((jc) => ({
      id: jc.candidate.id,
      name: jc.candidate.name,
      address: jc.candidate.address,
      badgeType: jc.candidate.badgeType,
      matchScore: jc.candidate.matchScore,
      selected: jc.selected,
    })),
  });
}
