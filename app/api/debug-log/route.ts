export async function POST(req: Request) {
  const body = await req.text();
  await fetch("http://127.0.0.1:7893/ingest/3d4f6f99-f80c-42e6-b46f-ea06df6e0712", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "8f4e86",
    },
    body,
  }).catch(() => {});
  return new Response("ok");
}
