import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const job = await prisma.jobPosting.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      candidates: {
        take: 3,
        orderBy: { candidate: { createdAt: "asc" } },
        include: { candidate: true },
      },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "No job posting found" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    title: job.title,
    subtitle: job.subtitle,
    badge: job.badge,
    secondaryText: job.secondaryText,
    candidates: job.candidates.map((jc) => ({
      id: jc.candidate.id,
      name: jc.candidate.name,
      address: jc.candidate.address,
      badgeType: jc.candidate.badgeType,
      matchScore: jc.candidate.matchScore,
      selected: jc.selected,
    })),
  });
}
