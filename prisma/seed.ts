import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CANDIDATE_NAMES = [
  "Zackary Hale Has . along name",
  "Margaret Chen Fitzgerald",
  "Oliver Blackwood-Smith",
  "Priya Nair Raghunathan",
  "Thomas Johanssen Berg",
  "Ayasha Running Bear",
  "Leonardo Da Costa Filho",
  "Sofía Martínez-Vega",
  "William O'Brien McCarthy",
  "Elena Petrov Kuznetsov",
  "Amara Okonkwo-Diallo",
  "Hiro Tanaka Watanabe",
  "Fatima Al-Rashid Hassan",
  "Björn Lindqvist Holm",
  "Chidinma Eze Okafor",
  "Yuki Nakamura Sato",
  "Rafael Torres Delgado",
  "Ingrid Svensson Larsen",
  "Kwame Asante Mensah",
  "Valentina Rossi Ferrari",
];

const ADDRESS = "Deåk Ferenc tér, Budapest, Hungary";

const ADDRESS_OVERRIDES: Record<string, string> = {
  "Zackary Hale Has . along name": "12 Rue de Rivoli, Paris, France",
  "Margaret Chen Fitzgerald": "25 Rue de la République, Lyon, France",
  "Oliver Blackwood-Smith": "8 Place de la Mairie, Rennes, France",
};

const BADGE_OVERRIDES: Record<string, string> = {
  "Margaret Chen Fitzgerald": "Referral",
  "Oliver Blackwood-Smith": "",
};

const EXPERIENCE = {
  dateRange: "Jan 2021 – Current (3 years)",
  title: "Courier",
  company: "Sprint Excel",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

const EDUCATION = {
  dateRange: "Jan 2021 – Sep 2025 (3 years)",
  degree: "Master of Science — Landscape Architecture",
  school: "New York University",
};

async function main() {
  await prisma.jobCandidate.deleteMany();
  await prisma.candidateExperience.deleteMany();
  await prisma.candidateEducation.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.jobPosting.deleteMany();

  const job = await prisma.jobPosting.create({
    data: {
      title: "Senior Sales Executive",
      subtitle: "REF402",
      badge: "Sourcing",
      secondaryText: "Secondary text",
    },
  });

  for (const name of CANDIDATE_NAMES) {
    const candidate = await prisma.candidate.create({
      data: {
        name,
        address: ADDRESS_OVERRIDES[name] ?? ADDRESS,
        badgeType: BADGE_OVERRIDES[name] ?? "Employee",
        matchScore: 2,
        subtitle: "A very long subtitle indeed",
        experience: {
          create: [EXPERIENCE, EXPERIENCE],
        },
        education: {
          create: [EDUCATION, EDUCATION],
        },
      },
    });

    await prisma.jobCandidate.create({
      data: {
        jobId: job.id,
        candidateId: candidate.id,
        selected: false,
      },
    });
  }

  console.log(`Seeded job posting "${job.title}" with ${CANDIDATE_NAMES.length} candidates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
