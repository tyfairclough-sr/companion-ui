export async function fetchJobPosting() {
  const res = await fetch("/api/job-postings");
  if (!res.ok) throw new Error("Failed to load job posting");
  return res.json();
}

export async function fetchCandidates() {
  const res = await fetch("/api/candidates");
  if (!res.ok) throw new Error("Failed to load candidates");
  return res.json();
}

export async function fetchCandidate(id: string) {
  const res = await fetch(`/api/candidates/${id}`);
  if (!res.ok) throw new Error("Failed to load candidate");
  return res.json();
}

export async function toggleCandidateSelection(id: string, selected: boolean) {
  const res = await fetch(`/api/candidates/${id}/select`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selected }),
  });
  if (!res.ok) throw new Error("Failed to update selection");
  return res.json();
}
