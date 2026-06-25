import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      experience: { orderBy: { createdAt: "asc" } },
      education: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: candidate.id,
    name: candidate.name,
    address: candidate.address,
    badgeType: candidate.badgeType,
    matchScore: candidate.matchScore,
    subtitle: candidate.subtitle,
    experience: candidate.experience,
    education: candidate.education,
  });
}
