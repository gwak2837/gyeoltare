export async function GET() {
  return Response.json({
    checkedAt: new Date().toISOString(),
    service: "web",
    status: "ok",
  });
}
