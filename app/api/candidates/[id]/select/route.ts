import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: candidateId } = await params;
  const body = await request.json().catch(() => ({}));
  const selected = typeof body.selected === "boolean" ? body.selected : undefined;

  const job = await prisma.jobPosting.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!job) {
    return NextResponse.json({ error: "No job posting found" }, { status: 404 });
  }

  const existing = await prisma.jobCandidate.findUnique({
    where: {
      jobId_candidateId: { jobId: job.id, candidateId },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Candidate not linked to job" }, { status: 404 });
  }

  const updated = await prisma.jobCandidate.update({
    where: {
      jobId_candidateId: { jobId: job.id, candidateId },
    },
    data: {
      selected: selected ?? !existing.selected,
    },
    include: { candidate: true },
  });

  return NextResponse.json({
    id: updated.candidate.id,
    selected: updated.selected,
  });
}
