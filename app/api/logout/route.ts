import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  cookieStore.delete("admin_auth");
  cookieStore.delete("role");

  return Response.json({ success: true, message: "Logged out" });
}
